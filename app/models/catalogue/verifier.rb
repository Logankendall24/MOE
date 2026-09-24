# Checks that every piece of text in db/catalogue actually appears on the page
# it cites — the guard against transcription errors and invented content.
#
# Comparison ignores whitespace and hyphens (PDF text breaks words across lines
# and columns) and treats ² as 2, but is otherwise exact.
class Catalogue::Verifier
  def problems
    content_problems + layout_problems + document_problems + space_name_problems + specialist_problems
  end

  private

  def space_name_problems
    Catalogue.space_names.flat_map do |group, names|
      names.filter_map do |key, n|
        missing(n.fetch("source"), n.fetch("page"), n["verbatim"] || n.fetch("label"), "space name #{group} #{key}")
      end
    end
  end

  # Each specialist space is named as its first sheet's title prints it.
  def specialist_problems
    Catalogue.specialist_types.flat_map do |category, spaces|
      spaces.filter_map do |name, space|
        sheet = Catalogue.layout(space.fetch("sheets").first)
        next "specialist #{category} #{name}: unknown sheet" unless sheet
        missing(sheet.source, sheet.pages.first, name, "specialist #{category}")
      end
    end
  end

  def document_problems
    Catalogue.documents.fetch("titles", {}).flat_map do |source, titles|
      titles.filter_map { |page, title| missing(source, page, title, "document title") }
    end
  end

  def content_problems
    Catalogue.categories.keys.flat_map do |category|
      content = Catalogue.content(category)
      doc = content.fetch("catalogue")
      checks = []

      %w[about acknowledgements how_it_works].each do |part|
        section = content.fetch(part)
        page = section.fetch("page")
        texts = [section["title"], *section["paragraphs"], *section["closing"]]
        texts += (section["groups"] || []).map { |g| g["label"] }
        (section["modules"] || []).each { |m| texts += m.values_at("name", "text", "area", "size") }
        (section["examples"] || []).each { |e| texts += e.values_at("caption", "note") }
        checks += texts.compact.map { |t| [doc, page, t, "#{category} #{part}"] }
      end

      content.fetch("sections").each do |section|
        section.fetch("blocks").each do |block|
          block_doc = block["doc"] || doc
          page = block.fetch("page")
          where = "#{category} #{section['id']} / #{block['heading']}"
          block_texts(block).each { |t| checks << [block_doc, page, t, where] }
        end
      end

      checks.filter_map { |d, p, text, where| missing(d, p, text, where) }
    end
  end

  def block_texts(block)
    texts = [block["heading"], *block["paragraphs"], *block["bullets"], *block["after"]]
    rows = (block["rows"] || []) + (block["rows_by_zone"] || {}).values.flatten
    rows.each { |r| texts += [r["label"], *(r["verbatim"] || r["value"]).split(" / ")] }
    texts.compact
  end

  def layout_problems
    Catalogue.layouts.flat_map do |layout|
      first = layout.pages.first
      checks = [[layout.source, first, layout.title, "layout #{layout.id} title"]]
      checks << [layout.source, first, layout.occupancy, "layout #{layout.id} occupancy"] if layout.occupancy
      layout.sheets.each_with_index do |sheet, i|
        checks << [layout.source, layout.pages[i], sheet, "layout #{layout.id} sheet #{i + 1}"]
      end
      checks.filter_map { |d, p, text, where| missing(d, p, text, where) }
    end
  end

  def missing(doc, page, text, where)
    page_text = Catalogue.page_text(doc, page)
    return "#{where}: no extracted text for #{doc} p#{page} (run rails catalogue:extract_text)" unless page_text
    return nil if normalize(page_text).include?(normalize(text))

    "#{where}: not found on #{doc} p#{page}: #{text.truncate(90)}"
  end

  def normalize(text)
    text.gsub(/[\s\-­‐]/, "").tr("²", "2")
  end
end
