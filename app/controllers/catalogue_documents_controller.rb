# Serves the original source PDFs so every piece of information can be traced
# back to its page. Only documents listed in db/catalogue/sources.yml.
class CatalogueDocumentsController < ApplicationController
  def show
    return head(:not_found) unless Catalogue.sources.key?(params[:source])

    source = Catalogue.sources.fetch(params[:source])
    expires_in 1.day # private: the site is behind SiteLock
    send_file Catalogue.pdf_path(params[:source]), type: "application/pdf",
              disposition: "inline", filename: source.fetch("file")
  end
end
