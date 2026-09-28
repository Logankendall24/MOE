# Serves layout sheets and page crops, rendered from the source PDFs on first
# request. Only pages and crops that db/catalogue references can be requested.
class CatalogueImagesController < ApplicationController
  def sheet
    source = params[:source]
    page = Integer(params[:page], exception: false)
    return head(:not_found) unless Catalogue.renderable_page?(source, page)

    send_rendered SheetRenderer.sheet(source, page, params[:size]), "image/jpeg"
  end

  def crop
    category = params[:category]
    return head(:not_found) unless Catalogue.category?(category)

    content = Catalogue.content(category)
    page, box, opts = self.class.find_crop(content, params[:crop])
    return head(:not_found) unless box

    path = SheetRenderer.crop(content.fetch("catalogue"), page, box, **opts)
    send_rendered path, path.extname == ".jpg" ? "image/jpeg" : "image/png"
  end

  # Every crop id a category's content defines (for catalogue:prerender).
  def self.crop_ids(content)
    ack = content.fetch("acknowledgements")["groups"].each_with_index.flat_map { |g, gi| g["logos"].each_index.map { |li| "ack-#{gi}-#{li}" } }
    how = content.fetch("how_it_works")
    heating = (content.dig("heating_options", "options") || []).each_index.flat_map { |i| ["heating-#{i}-0", "heating-#{i}-1"] }
    ack + how["modules"].each_index.map { |i| "module-#{i}" } + how["examples"].each_index.map { |i| "example-#{i}" } +
      (content["typologies"] || []).each_index.map { |i| "typology-#{i}" } + (content["figures"] || []).each_index.map { |i| "figure-#{i}" } +
      (content.dig("graphics", "renders") || []).each_index.map { |i| "render-#{i}" } + heating
  end

  # Crop ids are "<kind>-<index>" into the lists in the category's content
  # (acknowledgement logos take a group and logo index).
  def self.find_crop(content, id)
    kind, *index = id.to_s.split("-")
    index = index.map { |i| Integer(i, exception: false) }
    return nil if index.empty? || index.any?(&:nil?)

    case kind
    when "ack"
      ack = content.fetch("acknowledgements")
      [ack["page"], ack.dig("groups", index[0], "logos", index[1], "crop"), {}]
    when "module", "example"
      how = content.fetch("how_it_works")
      [how["page"], how.dig("#{kind}s", index[0], "crop"), {}]
    when "typology", "figure"
      item = content.fetch(kind == "typology" ? "typologies" : "figures", [])[index[0]]
      item && [item["page"], item["crop"], { dpi: 200 }]
    when "render"
      item = content.dig("graphics", "renders")&.[](index[0])
      item && [item["page"], item["crop"], { dpi: 150, format: "jpg" }]
    when "heating" # heating-<option>-<zone group: 0 for zones 1-3, 1 for 4-6>
      h = content["heating_options"]
      zone = h&.dig("options", index[0], "zones", %w[1-3 4-6][index[1].to_i])
      zone && [h["page"], zone["crop"], { dpi: 200 }]
    end
  end

  private

  def send_rendered(path, type)
    expires_in 1.year # private: the site is behind SiteLock
    send_file path, type:, disposition: "inline"
  rescue SheetRenderer::RenderError => e
    Rails.logger.error(e.message)
    head :service_unavailable
  end
end
