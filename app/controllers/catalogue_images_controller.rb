# Serves layout sheets and page crops, rendered from the source PDFs on first
# request. Only pages and crops that db/catalogue references can be requested.
class CatalogueImagesController < ApplicationController
  def sheet
    source = params[:source]
    page = Integer(params[:page], exception: false)
    allowed = Catalogue.layouts.any? { |l| l.source == source && l.pages.include?(page) }
    return head(:not_found) unless allowed

    send_rendered SheetRenderer.sheet(source, page, params[:size]), "image/jpeg"
  end

  def crop
    category = params[:category]
    return head(:not_found) unless Catalogue.category?(category)

    content = Catalogue.content(category)
    page, box = find_crop(content, params[:crop])
    return head(:not_found) unless box

    send_rendered SheetRenderer.crop(content.fetch("catalogue"), page, box), "image/png"
  end

  private

  def find_crop(content, id)
    kind, *index = id.to_s.split("-")
    index = index.map { |i| Integer(i, exception: false) }
    return nil if index.any?(&:nil?)

    case kind
    when "ack"
      ack = content.fetch("acknowledgements")
      [ack["page"], ack.dig("groups", index[0], "logos", index[1], "crop")]
    when "module", "example"
      how = content.fetch("how_it_works")
      [how["page"], how.dig("#{kind}s", index[0], "crop")]
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
