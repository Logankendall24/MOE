# Turns catalogue data into the JSON the design's interface renders. All
# selection logic lives in LayoutRules; this only shapes content and attaches
# image and source URLs.
class CataloguePresenter
  include Rails.application.routes.url_helpers

  KINDS = { "R" => "teaching", "S1" => "teaching", "S2" => "teaching", "S3" => "teaching",
            "D1" => "teaching", "D2" => "teaching", "D3" => "teaching",
            "L" => "library", "C" => "admin",
            "G1" => "gym", "G2" => "gym", "G4" => "gym", "H3" => "hall", "H8" => "hall", "H9" => "hall" }.freeze

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
      },
      figures: (@content["figures"] || []).each_with_index.map { |f, i| { title: f["title"], **crop_fields(f, "figure-#{i}") } },
      graphics: graphics,
      specialistSpaces: specialist_spaces,
      spaceNames: Catalogue.space_names.transform_values { |names| names.transform_values { |n| n["label"] } },
      models3d: Catalogue.models_3d
    }
  end

  # selection: building_type (R/S1/S2/S3/L/C), buildings, specialists, roll,
  # climate_zone, layout (the user's teaching layout letter A–D).
  def building(building_type:, buildings:, specialists:, roll:, climate_zone:, layout:)
    kind = KINDS.fetch(building_type, "teaching")
    rules = LayoutRules.new(LayoutRules::Selection.new(
      category: @category, kind:, buildings:, specialists:, roll:, building_type:
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
      customise: customise_docs(building_type),
      heating: heating_options(climate_zone),
      cladding: cladding_options,
      typology: (@content["typologies"] || []).each_with_index.filter_map do |t, i|
        { caption: t["caption"], **crop_fields(t, "typology-#{i}") } if t["types"].include?(building_type)
      end,
      model3d: Catalogue.models_3d[building_type] || Catalogue.models_3d["default"]
    }
  end

  private

  # Customise → Heating and ventilation: the three options with their text and
  # diagram for the school's zone group (NZBC zones 1-3 or 4-6).
  def heating_options(climate_zone)
    h = @content["heating_options"] or return nil
    group = climate_zone.to_i >= 4 ? 1 : 0
    key = %w[1-3 4-6][group]
    {
      zones: key.sub("-", "–"), source: source_ref(@catalogue, h["page"]),
      options: h.fetch("options").each_with_index.map do |o, i|
        zone = o.fetch("zones").fetch(key)
        _x, _y, w, ht = zone.fetch("crop")
        { id: o["id"], name: o["name"], paragraphs: o["paragraphs"] || [], text: zone["text"],
          src: crop_url("heating-#{i}-#{group}"), aspect: (w.to_f / ht).round(4) }
      end
    }
  end

  # Customise → Cladding: the three options with their bullets, example render
  # and colour list (finishes.yml: swatches from the PDF, supplier names matched).
  def cladding_options
    c = @content["cladding_options"] or return nil
    renders = @content.dig("graphics", "renders") || []
    {
      source: source_ref(@catalogue, c["page"]),
      namesNote: "Colour names are matched to the supplier's range by colour; the catalogue shows unnamed swatches.",
      options: c.fetch("options").map do |o|
        palette = Catalogue.finishes.dig("cladding", o["id"]) || {}
        render = o["render"] && renders[o["render"]]
        { id: o["id"], name: o["name"], bullets: o["bullets"] || [],
          render: render && { title: render["title"], **crop_fields(render, "render-#{o['render']}") },
          supplier: palette["supplier"], supplierUrl: palette["url"], supplierNote: palette["note"], free: !!palette["free"],
          colours: (palette["colours"] || []).map { |col| col.slice("name", "swatch", "url", "check") } }
      end
    }
  end

  # The cover's Graphics panel: example layout pages as document boxes, and
  # the example renders with their captions, grouped by the page they're on.
  def graphics
    g = @content["graphics"] || {}
    {
      layouts: (g["layouts"] || []).map { |p| page_doc(@catalogue, p) },
      renders: (g["renders"] || []).each_with_index.map do |r, i|
        { title: r["title"], bullets: r["bullets"] || [], group: Catalogue.page_title(@catalogue, r["page"]),
          **crop_fields(r, "render-#{i}") }
      end
    }
  end

  # A cropped region of a catalogue page: its image, shape and source page.
  def crop_fields(item, id)
    _x, _y, w, h = item.fetch("crop")
    { src: crop_url(id), aspect: (w.to_f / h).round(4), page: item["page"], source: source_ref(@catalogue, item["page"]) }
  end

  # The specialist spaces the requirements flow offers, named as the PDF does,
  # with the occupancy printed on each space's first sheet.
  def specialist_spaces
    Catalogue.specialist_types.fetch(@category, {}).map do |name, space|
      sheet = Catalogue.layout(space.fetch("sheets").first)
      { key: name, label: name, note: sheet&.occupancy.to_s }
    end
  end

  # Document boxes for the design's Customise steps, by step id. The layout
  # step also gets the general teaching layout sheets for this building type.
  def customise_docs(building_type)
    modules = LayoutRules.teaching_modules(@category, building_type)
    sheets = Catalogue.layouts.select { |l| l.for_category?(@category) && l.space == "teaching" && modules.include?(l.module_class) }
    Catalogue.customise_pages(@category).to_h do |step, pages|
      docs = pages.map { |p| page_doc(@catalogue, p) }
      docs += sheets.map { |l| page_doc(l.source, l.pages.first, title: l.title).merge(sheet: l.sheets.first, id: l.id, variant: l.variant) } if step == "layout"
      [step, docs]
    end
  end

  # The sections listed under further_information, in that order. A section
  # with `style: summary` is shown as its rows only (no paragraphs), with its
  # PDF pages below.
  def sections(kind:, specialists:, climate_zone:, building_type:, layout:)
    zone_group = climate_zone.to_i >= 4 ? "4-6" : "1-3"
    by_id = @content.fetch("sections").index_by { |s| s["id"] }
    @content.fetch("further_information").filter_map do |id|
      section = by_id.fetch(id)
      summary = section["style"] == "summary"
      blocks = section.fetch("blocks").select { |b| applies?(b, kind, specialists) }.map do |b|
        rows = b["rows_by_zone"] ? b["rows_by_zone"].fetch(zone_group) : (b["rows"] || [])
        {
          heading: b["heading"],
          paragraphs: summary ? [] : b["paragraphs"] || [],
          bullets: summary ? [] : b["bullets"] || [],
          after: summary ? [] : b["after"] || [],
          rows: rows.map { |r| { label: r["label"], value: r["value"], highlight: (r["type"] && r["type"] == building_type) || (r["layout"] && r["layout"] == layout) } },
          zoneNote: b["rows_by_zone"] ? "Shown for NZBC climate zones #{zone_group.sub('-', '–')}" : nil,
          source: source_ref(b["doc"] || @catalogue, b["page"])
        }
      end
      next if blocks.empty?
      # One document box per PDF page the section's text comes from.
      docs = blocks.map { |b| [b[:source][:key], b[:source][:page]] }.uniq.map { |key, page| page_doc(key, page) }
      # A summary section drops blocks that are only text.
      blocks = blocks.select { |b| b[:rows].any? } if summary
      { id: section["id"], title: section["title"], sub: section["sub"], summary:, blocks:, docs: }
    end
  end

  # A PDF page as the design's document box: title, the page as thumbnail
  # (and full size, for the on-screen viewer), and a link to the PDF page.
  def page_doc(key, page, title: Catalogue.page_title(key, page))
    source = Catalogue.sources.fetch(key)
    { title:, page:, sourceTitle: source["title"], thumb: sheet_url(key, page, "thumb"), full: sheet_url(key, page, "full"),
      src: catalogue_document_path(source: key, anchor: "page=#{page}") }
  end

  def applies?(block, kind, specialists)
    return false if block["applies_to"] && !block["applies_to"].include?(kind)
    condition = block["when"] || {}
    return false if condition["specialists"] == "any" && specialists.empty?
    return false if condition["specialist_any_of"] && (condition["specialist_any_of"] & specialists).empty?
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
