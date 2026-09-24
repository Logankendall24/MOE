require "test_helper"

class CatalogueTest < ActiveSupport::TestCase
  test "every quote and sheet reference appears on the page it cites" do
    skip "run `rails catalogue:extract_text` first" unless Catalogue::SOURCE_TEXT_DIR.exist?
    assert_empty Catalogue::Verifier.new.problems
  end

  test "sheet ids are unique" do
    ids = Catalogue.layouts.map(&:id)
    assert_equal ids.uniq, ids
  end

  test "every sheet cites a known source and its pages line up with its drawing numbers" do
    Catalogue.layouts.each do |layout|
      assert Catalogue.sources.key?(layout.source), "#{layout.id}: unknown source #{layout.source}"
      assert layout.sheets.empty? || layout.sheets.size == layout.pages.size, "#{layout.id}: pages and sheets differ"
      layout.categories.each { |c| assert Catalogue.category?(c), "#{layout.id}: unknown category #{c}" }
    end
  end

  test "a category-specific document only feeds that category" do
    Catalogue.layouts.each do |layout|
      owner = Catalogue.sources.dig(layout.source, "category")
      next if owner == "shared"
      assert_equal [owner], layout.categories, "#{layout.id} from a #{owner} document is tagged #{layout.categories}"
    end
  end

  test "specialist mappings point at specialist sheets in the same category" do
    Catalogue.specialist_types.each do |category, spaces|
      spaces.each do |type, space|
        (space.fetch("sheets") + (space["supporting"] || [])).each do |id|
          layout = Catalogue.layout(id)
          assert layout, "#{category}/#{type}: no sheet #{id}"
          assert_equal "specialist", layout.space, "#{category}/#{type}: #{id} is not a specialist sheet"
          assert layout.for_category?(category), "#{category}/#{type}: #{id} is not a #{category} sheet"
        end
      end
    end
  end

  test "each category's teaching modules are defined" do
    Catalogue.categories.each do |key, category|
      assert category.fetch("teaching_modules").key?("*"), "#{key}: no module for other building types"
      category.fetch("teaching_modules").values.flatten.each { |m| assert Catalogue.modules.key?(m), "#{key}: module #{m}" }
    end
  end
end
