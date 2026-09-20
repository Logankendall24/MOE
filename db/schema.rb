# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_09_20_090157) do
  create_table "building_types", force: :cascade do |t|
    t.boolean "admin_compatible"
    t.string "category"
    t.string "code"
    t.text "configurable_elements"
    t.datetime "created_at", null: false
    t.string "depth"
    t.text "fixed_elements"
    t.boolean "hall_gym_compatible"
    t.string "name"
    t.string "status", default: "prototype_placeholder", null: false
    t.text "storeys_supported"
    t.text "summary"
    t.integer "teaching_space_max"
    t.integer "teaching_space_min"
    t.datetime "updated_at", null: false
    t.index ["category"], name: "index_building_types_on_category"
    t.index ["code"], name: "index_building_types_on_code", unique: true
  end

  create_table "building_types_school_types", id: false, force: :cascade do |t|
    t.integer "building_type_id", null: false
    t.integer "school_type_id", null: false
    t.index ["building_type_id", "school_type_id"], name: "idx_on_building_type_id_school_type_id_f8e4681ee2", unique: true
  end

  create_table "building_types_sources", id: false, force: :cascade do |t|
    t.integer "building_type_id", null: false
    t.integer "source_id", null: false
    t.index ["building_type_id", "source_id"], name: "index_building_types_sources_on_building_type_id_and_source_id", unique: true
  end

  create_table "layouts", force: :cascade do |t|
    t.integer "building_type_id", null: false
    t.datetime "created_at", null: false
    t.string "name"
    t.text "notes"
    t.datetime "updated_at", null: false
    t.index ["building_type_id"], name: "index_layouts_on_building_type_id"
  end

  create_table "layouts_spaces", id: false, force: :cascade do |t|
    t.integer "layout_id", null: false
    t.integer "space_id", null: false
    t.index ["layout_id", "space_id"], name: "index_layouts_spaces_on_layout_id_and_space_id", unique: true
  end

  create_table "requirements", force: :cascade do |t|
    t.string "configuration_preference"
    t.datetime "created_at", null: false
    t.integer "current_roll"
    t.text "facilities_requested"
    t.integer "projected_roll"
    t.integer "school_type_id", null: false
    t.string "session_token"
    t.text "site_notes"
    t.integer "specialist_spaces_required"
    t.integer "teaching_spaces_required"
    t.datetime "updated_at", null: false
    t.index ["school_type_id"], name: "index_requirements_on_school_type_id"
  end

  create_table "rules", force: :cascade do |t|
    t.integer "building_type_id", null: false
    t.text "condition"
    t.datetime "created_at", null: false
    t.text "description"
    t.integer "source_id"
    t.string "status", default: "prototype_placeholder", null: false
    t.datetime "updated_at", null: false
    t.index ["building_type_id"], name: "index_rules_on_building_type_id"
    t.index ["source_id"], name: "index_rules_on_source_id"
  end

  create_table "school_types", force: :cascade do |t|
    t.string "code"
    t.datetime "created_at", null: false
    t.string "label"
    t.text "notes"
    t.datetime "updated_at", null: false
    t.index ["code"], name: "index_school_types_on_code", unique: true
  end

  create_table "sources", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "document_name"
    t.string "file_path"
    t.string "ministry_source_url"
    t.integer "page"
    t.string "section"
    t.datetime "updated_at", null: false
    t.string "version_label"
  end

  create_table "spaces", force: :cascade do |t|
    t.string "category"
    t.datetime "created_at", null: false
    t.string "name"
    t.text "notes"
    t.float "typical_area_m2"
    t.datetime "updated_at", null: false
    t.index ["category"], name: "index_spaces_on_category"
  end

  add_foreign_key "layouts", "building_types"
  add_foreign_key "requirements", "school_types"
  add_foreign_key "rules", "building_types"
  add_foreign_key "rules", "sources"
end
