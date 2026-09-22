# Loads structured Ministry standard-design data from db/data/*.yml.
# Kept separate from the application code so the data can be updated (or replaced once
# real Ministry PDFs are supplied) without touching models, controllers, or views.
# Idempotent: safe to re-run.

data_dir = Rails.root.join("db", "data")

sources_by_key = {}
YAML.load_file(data_dir.join("sources.yml")).each do |row|
  key = row.fetch("key")
  source = Source.find_or_create_by!(document_name: row["document_name"]) do |s|
    s.ministry_source_url = row["ministry_source_url"]
    s.page = row["page"]
    s.section = row["section"]
    s.version_label = row["version_label"]
    s.file_path = row["file_path"]
  end
  sources_by_key[key] = source
end
puts "Seeded #{sources_by_key.size} sources"

school_types_by_code = {}
YAML.load_file(data_dir.join("school_types.yml")).each do |row|
  school_type = SchoolType.find_or_create_by!(code: row["code"]) do |s|
    s.label = row["label"]
    s.notes = row["notes"]
  end
  school_type.update!(label: row["label"], notes: row["notes"])
  school_types_by_code[row["code"]] = school_type
end
puts "Seeded #{school_types_by_code.size} school types"

building_types_by_code = {}
YAML.load_file(data_dir.join("building_types.yml")).each do |row|
  building_type = BuildingType.find_or_initialize_by(code: row["code"])
  building_type.assign_attributes(
    name: row["name"],
    category: row["category"],
    depth: row["depth"],
    storeys_supported: row["storeys_supported"],
    teaching_space_min: row["teaching_space_min"],
    teaching_space_max: row["teaching_space_max"],
    admin_compatible: row["admin_compatible"],
    hall_gym_compatible: row["hall_gym_compatible"],
    fixed_elements: row["fixed_elements"] || [],
    configurable_elements: row["configurable_elements"] || [],
    summary: row["summary"],
    status: row["status"] || "prototype_placeholder"
  )
  building_type.save!

  building_type.school_types = Array(row["school_type_codes"]).map { |code| school_types_by_code.fetch(code) }
  building_type.sources = Array(row["source_keys"]).map { |key| sources_by_key.fetch(key) }
  building_types_by_code[row["code"]] = building_type
end
puts "Seeded #{BuildingType.count} building types"

spaces_by_key = {}
YAML.load_file(data_dir.join("spaces.yml")).each do |row|
  key = row.fetch("key")
  space = Space.find_or_create_by!(name: row["name"]) do |s|
    s.category = row["category"]
    s.typical_area_m2 = row["typical_area_m2"]
    s.notes = row["notes"]
  end
  space.update!(category: row["category"], typical_area_m2: row["typical_area_m2"], notes: row["notes"])
  spaces_by_key[key] = space
end
puts "Seeded #{spaces_by_key.size} spaces"

YAML.load_file(data_dir.join("layouts.yml")).each do |row|
  building_type = building_types_by_code.fetch(row.fetch("building_type_code"))
  layout = Layout.find_or_initialize_by(name: row["name"], building_type: building_type)
  layout.notes = row["notes"]
  layout.save!
  layout.spaces = Array(row["space_keys"]).map { |key| spaces_by_key.fetch(key) }
end
puts "Seeded #{Layout.count} layouts"
