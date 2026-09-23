# Read-only access to the standard-design catalogue in db/catalogue/.
#
# The catalogue is structured data transcribed from the Ministry PDFs, kept as
# YAML so it can be corrected or extended without migrations or UI changes.
# Every fact cites a source document (sources.yml) and page.
class Catalogue
  DATA_DIR = Rails.root.join("db", "catalogue")
  PDF_DIR = Rails.root.join("docs", "source-pdfs")
  SOURCE_TEXT_DIR = Rails.root.join("docs", "source-text", "pages")

  Layout = Data.define(:id, :title, :source, :pages, :sheets, :categories, :space,
                       :variant, :module_class, :grid_mm, :occupancy, :roll_band) do
    def self.from(row)
      new(
        id: row.fetch("id"), title: row.fetch("title"), source: row.fetch("source"),
        pages: row.fetch("pages"), sheets: row["sheets"] || [], categories: row.fetch("categories"),
        space: row.fetch("space"), variant: row["variant"], module_class: row["module"],
        grid_mm: row["grid_mm"], occupancy: row["occupancy"], roll_band: row["roll_band"]
      )
    end

    def for_category?(category) = categories.include?(category)

    def roll_fits?(roll)
      return true unless roll_band
      roll.between?(roll_band.fetch("min"), roll_band.fetch("max"))
    end
  end

  class << self
    def sources = read("sources")
    def categories = read("categories").except("modules")
    def modules = read("categories").fetch("modules")
    def specialist_types = read("specialist_types")
    def models_3d = read("models_3d")
    def content(category) = read("content/#{category}")

    def layouts
      read("layouts").map { |row| Layout.from(row) }
    end

    def layout(id) = layouts.find { |l| l.id == id }

    def category?(key) = categories.key?(key)

    def pdf_path(source_key) = PDF_DIR.join(sources.fetch(source_key).fetch("file"))

    # PDF pages shown as document boxes: see documents.yml.
    def documents = read("documents")

    # The heading printed on a page, or the document's title if none is listed.
    def page_title(source_key, page)
      documents.dig("titles", source_key, page) || sources.fetch(source_key).fetch("title")
    end

    # Pages for each of the design's Customise steps, in the category's catalogue.
    def customise_pages(category) = documents.dig("customise", category) || {}

    # Pages the site may render as images: layout sheets, plus every page the
    # catalogue text, document titles or Customise steps refer to.
    def renderable_page?(source_key, page)
      renderable_pages.include?([source_key, page])
    end

    def renderable_pages
      pages = layouts.flat_map { |l| l.pages.map { |p| [l.source, p] } }
      documents.fetch("titles", {}).each { |source, titles| pages += titles.keys.map { |p| [source, p] } }
      categories.each_key do |category|
        content = content(category)
        doc = content.fetch("catalogue")
        content.fetch("sections").each { |s| s.fetch("blocks").each { |b| pages << [b["doc"] || doc, b.fetch("page")] } }
        customise_pages(category).each_value { |list| pages += list.map { |p| [doc, p] } }
      end
      pages.to_set
    end

    def page_text(source_key, page)
      path = SOURCE_TEXT_DIR.join("#{source_key}.txt")
      return nil unless path.exist?
      File.read(path, encoding: "UTF-8").split("\f")[page - 1]
    end

    private

    # Re-read a file whenever it changes, so edits show up without a restart.
    def read(name)
      path = DATA_DIR.join("#{name}.yml")
      mtime = File.mtime(path)
      @cache ||= {}
      cached = @cache[name]
      return cached[:data] if cached && cached[:mtime] == mtime

      data = YAML.safe_load_file(path, permitted_classes: [], aliases: false) || {}
      @cache[name] = { mtime:, data: }
      data
    end
  end
end
