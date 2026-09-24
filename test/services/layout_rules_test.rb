require "test_helper"

class LayoutRulesTest < ActiveSupport::TestCase
  SCIENCE = "Science Specialist (Chemistry / Biology / Physics)".freeze
  ART = "Visual Arts (Painting / Creative Arts / Design / Photography)".freeze

  def run_rules(category:, kind:, buildings: %w[teaching], specialists: [], roll: nil, building_type: "S1")
    LayoutRules.new(LayoutRules::Selection.new(category:, kind:, buildings:, specialists:, roll:, building_type:)).call
  end

  def ids(result, key = nil)
    groups = key ? result.groups.select { |g| g.key == key } : result.groups
    groups.flat_map { |g| g.layouts.map(&:id) }
  end

  test "primary teaching shows only 12 m x 7.2 m (A) layouts and the resource module" do
    result = run_rules(category: "primary_intermediate", kind: "teaching")
    assert_equal %w[001 002 003 004 005], ids(result, "standard")
  end

  test "secondary S types and relocatables use only the 10.5 m x 7.2 m (B) module" do
    %w[S1 S2 S3 R].each do |type|
      result = run_rules(category: "secondary", kind: "teaching", building_type: type)
      assert_equal %w[010 011 012 087], ids(result, "standard"), type
    end
  end

  test "secondary D types use only the 8 m x 8.4 m (C) module" do
    %w[D1 D2 D3].each do |type|
      result = run_rules(category: "secondary", kind: "teaching", building_type: type)
      assert_equal %w[020 021 022 087], ids(result, "standard"), type
    end
  end

  test "standard and specialist layouts are one line each" do
    result = run_rules(category: "secondary", kind: "teaching", specialists: [SCIENCE, ART])
    assert_equal %w[standard specialist], result.groups.map(&:key)
  end

  test "the specialist line holds only the selected spaces and their supporting rooms" do
    result = run_rules(category: "secondary", kind: "teaching", specialists: [SCIENCE])
    assert_equal %w[051 085 086], ids(result, "specialist")
    refute_includes ids(result), "070", "an unselected specialist space leaked in"
  end

  test "supporting rooms shared by two selected spaces appear once" do
    result = run_rules(category: "secondary", kind: "teaching",
                       specialists: [SCIENCE, "Science General / Primary Industry"])
    assert_equal %w[051 085 086 050], ids(result, "specialist")
  end

  test "every secondary specialist space in the PDFs can be selected" do
    spaces = Catalogue.specialist_types.fetch("secondary")
    assert_equal 13, spaces.size
    specialist_sheets = Catalogue.layouts.select { |l| l.space == "specialist" }.map(&:id)
    covered = spaces.values.flat_map { |s| s["sheets"] + s["supporting"] }
    assert_empty specialist_sheets - covered, "specialist sheets no space can show"
  end

  test "unselected specialist types are not shown" do
    result = run_rules(category: "secondary", kind: "teaching", specialists: [])
    assert result.groups.none? { |g| g.key == "specialist" }
  end

  test "specialist spaces are offered to primary schools too" do
    result = run_rules(category: "primary_intermediate", kind: "teaching", specialists: [SCIENCE])
    assert_equal %w[051 085 086], ids(result, "specialist")
  end
  
  test "an unknown specialist name is noted rather than guessed" do
    result = run_rules(category: "primary_intermediate", kind: "teaching", specialists: %w[Science])
    assert_empty ids(result, "specialist")
    assert_match(/No Science specialist layouts/, result.notes.join)
  end

  test "library layouts are filtered by projected roll" do
    result = run_rules(category: "primary_intermediate", kind: "library", buildings: %w[teaching library], roll: 350)
    assert_equal %w[100], ids(result, "library")
    assert_equal %w[101], result.excluded.map { |e| e[:layout].id }
    assert_match(/500 - 800 Student Roll/, result.excluded.first[:reason])
  end

  test "a roll below every secondary library band shows none and explains why" do
    result = run_rules(category: "secondary", kind: "library", buildings: %w[library], roll: 350)
    assert_empty ids(result, "library")
    assert_equal %w[101 102], result.excluded.map { |e| e[:layout].id }
    assert_match(/No standard library layout covers/, result.notes.join)
  end

  test "a roll of exactly 800 fits both library bands, as the sheets print them" do
    result = run_rules(category: "secondary", kind: "library", buildings: %w[library], roll: 800)
    assert_equal %w[101 102], ids(result, "library")
  end

  test "primary admin above the largest band shows none" do
    result = run_rules(category: "primary_intermediate", kind: "admin", buildings: %w[admin], roll: 900)
    assert_empty ids(result, "admin")
    assert_match(/No standard administration layout covers a projected roll of 900/, result.notes.join)
  end

  test "secondary admin sheets state staff numbers, so none are filtered out by roll" do
    result = run_rules(category: "secondary", kind: "admin", buildings: %w[admin], roll: 350)
    assert_equal 10, ids(result, "admin").size
    assert_empty result.excluded
  end

  test "halls follow the sheet's own category" do
    primary = run_rules(category: "primary_intermediate", kind: "teaching", buildings: %w[teaching hall])
    secondary = run_rules(category: "secondary", kind: "teaching", buildings: %w[teaching hall])
    assert_equal %w[halls-primary halls-layouts], ids(primary, "hall")
    assert_equal %w[halls-secondary], ids(secondary, "hall")
  end

  test "gyms appear only when in scope" do
    assert_empty ids(run_rules(category: "secondary", kind: "teaching"), "gym")
    assert_equal 3, ids(run_rules(category: "secondary", kind: "teaching", buildings: %w[teaching gym]), "gym").size
  end

  test "apart from shared specialist sheets, no result contains a sheet from the other category" do
    Catalogue.categories.each_key do |category|
      %w[teaching library admin].each do |kind|
        result = run_rules(category:, kind:, buildings: %w[teaching library admin gym hall],
                           specialists: [SCIENCE, ART, "Science"], roll: 600)
        result.groups.reject { |g| g.key == "specialist" }.flat_map(&:layouts).each do |layout|
          assert_includes layout.categories, category, "#{layout.id} shown in #{category}"
        end
      end
    end
  end
end
