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
    page, box, opts = find_crop(content, params[:crop])
    return head(:not_found) unless box

    path = SheetRenderer.crop(content.fetch("catalogue"), page, box, **opts)
    send_rendered path, path.extname == ".jpg" ? "image/jpeg" : "image/png"
  end

  private

  # Crop ids are "<kind>-<index>" into the lists in the category's content
  # (acknowledgement logos take a group and logo index).
  def find_crop(content, id)
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
    end
  end

  def send_rendered(path, type)
    expires_in 1.year # private: the site is behind SiteLock
    send_file path, type:, disposition: "inline"
  rescue SheetRenderer::RenderError => e
    Rails.logger.error(e.message)
    head :service_unavailable
  end
end
