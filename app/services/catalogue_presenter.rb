# Turns catalogue data into the JSON the design's interface renders. All
# selection logic lives in LayoutRules; this only shapes content and attaches
# image and source URLs.
class CataloguePresenter
  include Rails.application.routes.url_helpers

  KINDS = { "R" => "teaching", "S1" => "teaching", "S2" => "teaching", "S3" => "teaching",
            "L" => "library", "C" => "admin" }.freeze

  def initialize(category)
    @category = category
    @content = Catalogue.content(category)
    @catalogue = @content.fetch("catalogue")
  end

  def about
    ack = @content.fetch("acknowledgements")
    how = @content.fetch("how_it_works")
    {
      category: @category,
      categoryLabel: Catalogue.categories.dig(@category, "label"),
      catalogue: source_ref(@catalogue),
      about: { paragraphs: @content.dig("about", "paragraphs"), source: source_ref(@catalogue, @content.dig("about", "page")) },
      acknowledgements: {
        paragraphs: ack["paragraphs"],
        source: source_ref(@catalogue, ack["page"]),
        groups: ack["groups"].each_with_index.map do |group, gi|
          { label: group["label"],
            logos: group["logos"].each_with_index.map { |logo, li| { name: logo["name"], src: crop_url("ack-#{gi}-#{li}") } } }
        end
      },
      howItWorks: {
        title: how["title"],
        paragraphs: how["paragraphs"],
        closing: how["closing"],
        source: source_ref(@catalogue, how["page"]),
        modules: how["modules"].each_with_index.map { |m, i| m.slice("name", "text", "area", "size").merge(src: crop_url("module-#{i}")) },
        examples: how["examples"].each_with_index.map do |e, i|
          e.slice("caption", "note").merge(src: crop_url("example-#{i}"), aspect: "#{e['crop'][2]} / #{e['crop'][3]}")
        end
      }
    }
  end

  # selection: building_type (R/S1/S2/S3/L/C), buildings, specialists, roll,
  # climate_zone, layout (the user's teaching layout letter A–D).
  def building(building_type:, buildings:, specialists:, roll:, climate_zone:, layout:)
    kind = KINDS.fetch(building_type, "teaching")
    rules = LayoutRules.new(LayoutRules::Selection.new(
      category: @category, kind:, buildings:, specialists:, roll:
    )).call

    {
      category: @category,
      kind:,
      diagrams: {
        groups: rules.groups.map { |g| { key: g.key, label: g.label, note: g.note, layouts: g.layouts.map { |l| layout_card(l) } } },
        excluded: rules.excluded.map { |e| { title: e[:layout].title, reason: e[:reason] } },
        notes: rules.notes
      },
      sections: sections(kind:, specialists:, climate_zone:, building_type:, layout:),
      customise: customise_docs,
      model3d: Catalogue.models_3d[building_type] || Catalogue.models_3d["default"]
    }
  end

  private

  # Document boxes for the design's Customise steps, by step id. The layout
  # step also gets the category's general teaching layout sheets.
  def customise_docs
    modules = Catalogue.categories.dig(@category, "teaching_modules") || []
    sheets = Catalogue.layouts.select { |l| l.for_category?(@category) && l.space == "teaching" && modules.include?(l.module_class) }
    Catalogue.customise_pages(@category).to_h do |step, pages|
      docs = pages.map { |p| page_doc(@catalogue, p) }
      docs += sheets.map { |l| page_doc(l.source, l.pages.first, title: l.title).merge(sheet: l.sheets.first) } if step == "layout"
      [step, docs]
    end
  end

  def sections(kind:, specialists:, climate_zone:, building_type:, layout:)
    zone_group = climate_zone.to_i >= 4 ? "4-6" : "1-3"
    @content.fetch("sections").filter_map do |section|
      blocks = section.fetch("blocks").select { |b| applies?(b, kind, specialists) }.map do |b|
        rows = b["rows_by_zone"] ? b["rows_by_zone"].fetch(zone_group) : (b["rows"] || [])
        {
          heading: b["heading"],
          paragraphs: b["paragraphs"] || [],
          bullets: b["bullets"] || [],
          after: b["after"] || [],
          rows: rows.map { |r| { label: r["label"], value: r["value"], highlight: (r["type"] && r["type"] == building_type) || (r["layout"] && r["layout"] == layout) } },
          zoneNote: b["rows_by_zone"] ? "Shown for NZBC climate zones #{zone_group.sub('-', '–')}" : nil,
          source: source_ref(b["doc"] || @catalogue, b["page"])
        }
      end
      next if blocks.empty?
      # One document box per PDF page the section's text comes from.
      docs = blocks.map { |b| [b[:source][:key], b[:source][:page]] }.uniq.map { |key, page| page_doc(key, page) }
      { id: section["id"], title: section["title"], sub: section["sub"], blocks:, docs: }
    end
  end

  # A PDF page as the design's document box: title, the page as thumbnail, and
  # a link that opens the PDF at that page.
  def page_doc(key, page, title: Catalogue.page_title(key, page))
    source = Catalogue.sources.fetch(key)
    { title:, page:, sourceTitle: source["title"], thumb: sheet_url(key, page, "thumb"),
      src: catalogue_document_path(source: key, anchor: "page=#{page}") }
  end

  def applies?(block, kind, specialists)
    return false if block["applies_to"] && !block["applies_to"].include?(kind)
    condition = block["when"] || {}
    return false if condition["specialists"] == "any" && specialists.empty?
    return false if condition["specialist"] && !specialists.include?(condition["specialist"])
    true
  end

  def layout_card(layout)
    module_class = layout.module_class
    {
      id: layout.id,
      title: layout.title,
      occupancy: layout.occupancy,
      module: module_class && "#{module_class} · #{Catalogue.modules.dig(module_class, 'size')}",
      pages: layout.pages.each_with_index.map do |page, i|
        { page:, sheet: layout.sheets[i], thumb: sheet_url(layout.source, page, "thumb"), full: sheet_url(layout.source, page, "full") }
      end,
      source: source_ref(layout.source, layout.pages.first)
    }
  end

  def source_ref(key, page = nil)
    source = Catalogue.sources.fetch(key)
    { key:, title: source["title"], version: source["version"], page:,
      url: catalogue_document_path(source: key, anchor: page && "page=#{page}") }
  end

  def sheet_url(source, page, size)
    catalogue_sheet_path(source:, page:, size:, v: SheetRenderer.version(source))
  end

  def crop_url(id)
    catalogue_crop_path(category: @category, crop: id, v: SheetRenderer.version(@catalogue))
  end
end
