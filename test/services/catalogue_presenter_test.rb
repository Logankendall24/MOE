require "test_helper"

class CataloguePresenterTest < ActiveSupport::TestCase
  def building(category, **opts)
    defaults = { building_type: "S1", buildings: %w[teaching], specialists: [], roll: 300, climate_zone: "3", layout: "A" }
    CataloguePresenter.new(category).building(**defaults, **opts)
  end

  def page_of(doc) = doc[:src][/page=(\d+)/, 1].to_i
  def source_of(doc) = doc[:src][%r{documents/(\w+)}, 1]

  test "each section's document boxes include every page its text cites" do
    building("primary_intermediate")[:sections].each do |section|
      cited = section[:blocks].map { |b| [b[:source][:key], b[:source][:page]] }.uniq
      assert_empty cited - section[:docs].map { |d| [source_of(d), page_of(d)] }, section[:id]
    end
  end

  test "further information shows only the sections listed for it" do
    %w[primary_intermediate secondary].each do |category|
      assert_equal %w[climate], building(category)[:sections].map { |s| s[:id] }, category
    end
  end

  test "climate is a summary: the zone's rows, no paragraphs, and its PDF pages" do
    climate = building("primary_intermediate", climate_zone: "5")[:sections].first
    assert climate[:summary]
    assert climate[:blocks].all? { |b| b[:paragraphs].empty? && b[:rows].any? }
    assert_match(/mechanical heat recovery/, climate[:blocks].first[:rows].first[:value])
    assert_equal [20, 19], climate[:docs].map { |d| d[:page] }
  end

  test "the requirements flow offers every specialist space by its PDF name, in both categories" do
    spaces = CataloguePresenter.new("secondary").about[:specialistSpaces]
    assert_equal 13, spaces.size
    assert_includes spaces.map { |s| s[:label] }, "Dance"
    assert_equal 13, CataloguePresenter.new("primary_intermediate").about[:specialistSpaces].size
  end

  test "customise steps use the category's own catalogue and teaching sheets" do
    { "primary_intermediate" => %w[primary_catalogue primary_teaching],
      "secondary" => %w[secondary_catalogue secondary_teaching] }.each do |category, allowed|
      steps = building(category)[:customise]
      assert_equal %w[cladding layout heating], steps.keys
      steps.each_value { |docs| docs.each { |d| assert_includes allowed, source_of(d), "#{category}: #{d[:title]}" } }
    end
  end

  test "primary teaching layout step includes layouts A to D" do
    titles = building("primary_intermediate")[:customise]["layout"].map { |d| d[:title] }
    %w[001 002 003 004].each { |id| assert titles.any? { |t| t.include?(id) }, "missing layout #{id}" }
  end

  test "every document box can be rendered" do
    %w[primary_intermediate secondary].each do |category|
      data = building(category)
      docs = data[:sections].flat_map { |s| s[:docs] } + data[:customise].values.flatten
      docs.each { |d| assert Catalogue.renderable_page?(source_of(d), page_of(d)), "#{category}: #{d[:title]}" }
    end
  end

  test "every building type gets a 3D model, falling back to the default" do
    %w[R S1 S2 S3 L C].each do |type|
      model = building("primary_intermediate", building_type: type)[:model3d]
      assert model, "no model for #{type}"
      assert Rails.root.join("public", model["glb"].delete_prefix("/")).exist?, "missing file #{model['glb']}"
    end
  end

  test "pages nothing refers to cannot be rendered" do
    assert_not Catalogue.renderable_page?("primary_catalogue", 1)
    assert_not Catalogue.renderable_page?("primary_catalogue", 999)
  end

  test "each building type gets its own typology diagrams, from its own catalogue" do
    d2 = building("secondary", building_type: "D2")[:typology]
    assert_equal ["D2 – Double-depth, two-storey", "Example: 14-teaching-space secondary school block with half bay amenities module."],
                 d2.map { |t| t[:caption].first }
    assert d2.all? { |t| t[:source][:key] == "secondary_catalogue" }
    assert_equal ["S1 – Single-depth, single-storey (typical)", "S1 – Single-depth, single-storey (gabled roof)", "Typical floor Plan – S1 (S2, S3 multi-storey similar)"],
                 building("primary_intermediate", building_type: "S1")[:typology].map { |t| t[:caption].first }
    assert_empty building("primary_intermediate", building_type: "L")[:typology]
  end

  test "heating options follow the site's zone group, with their own diagrams" do
    cold = building("secondary", climate_zone: "5")[:heating]
    warm = building("secondary", climate_zone: "2")[:heating]
    assert_equal %w[default alt01 alt02], cold[:options].map { |o| o[:id] }
    assert_equal "4–6", cold[:zones]
    assert_match(/mechanical heat recovery/, cold[:options].first[:text])
    assert_equal "Electric ceiling radiators and natural ventilation.", warm[:options].first[:text]
    assert_match(%r{crops/secondary/heating-0-1}, cold[:options].first[:src])
  end

  test "cladding options carry their colour lists and example render" do
    options = building("primary_intermediate")[:cladding][:options]
    assert_equal %w[A B C], options.map { |o| o[:id] }
    assert_equal [15, 6, 0], options.map { |o| o[:colours].size }
    assert options.last[:free], "painted fibre cement takes any Resene colour"
    assert options.all? { |o| o[:render] && o[:supplierUrl].start_with?("https://") }
  end

  test "about has the how-it-works figures and the graphics panel's layouts and renders" do
    about = CataloguePresenter.new("secondary").about
    assert_equal ["Introduction", "How our building modules work"], about[:figures].map { |f| f[:title] }
    assert_equal [9, 12, 13, 10, 11, 14], about[:graphics][:layouts].map { |d| d[:page] }
    assert_equal ["Examples: Exteriors"] * 3 + ["Examples: Interiors"] * 3, about[:graphics][:renders].map { |r| r[:group] }
    about[:graphics][:layouts].each { |d| assert Catalogue.renderable_page?("secondary_catalogue", d[:page]) }
  end
end
