# Decides which standard layout sheets are relevant to a user's requirements.
#
# The facts about each sheet live in db/catalogue/layouts.yml; the decisions
# (which module sizes a category uses, which sheets a specialist type covers)
# live in categories.yml and specialist_types.yml. This class only applies them.
#
# Sheets from the other school category are never considered at all. Sheets
# that are in the right category but ruled out by the user's requirements (a
# roll outside the sheet's band) are returned under `excluded` with the reason,
# so the interface can explain why they aren't shown.
class LayoutRules
  Selection = Data.define(:category, :kind, :buildings, :specialists, :roll) do
    # kind: the building the user is looking at — teaching, library or admin.
    def in_scope?(space) = buildings.include?(space)
  end

  Group = Data.define(:key, :label, :note, :layouts)
  Result = Data.define(:groups, :excluded, :notes)

  def initialize(selection)
    @s = selection
    @category = Catalogue.categories.fetch(selection.category)
    @sheets = Catalogue.layouts.select { |l| l.for_category?(selection.category) }
  end

  def call
    groups = []
    excluded = []
    notes = []

    case @s.kind
    when "teaching"
      groups << teaching_group
      groups.concat(specialist_groups(notes))
    when "library", "admin"
      group, out, note = roll_group(@s.kind)
      groups << group if group
      excluded.concat(out)
      notes << note if note
    end

    %w[gym hall].each do |space|
      next unless @s.in_scope?(space)
      sheets = @sheets.select { |l| l.space == space }
      groups << Group.new(key: space, label: "#{space.capitalize} — also in scope for this project",
                          note: "The gyms and halls document states no roll or occupancy for its layouts, so these are not filtered by roll.",
                          layouts: sheets)
    end

    Result.new(groups: groups.reject { |g| g.layouts.empty? }, excluded:, notes:)
  end

  private

  def teaching_group
    modules = @category.fetch("teaching_modules")
    general = @sheets.select { |l| l.space == "teaching" && modules.include?(l.module_class) }
    support = @sheets.select { |l| l.space == "support" }
    sizes = modules.map { |m| "#{m} (#{Catalogue.modules.dig(m, 'size')})" }.join(" and ")
    Group.new(key: "teaching", label: "Teaching spaces — module #{sizes}", note: nil, layouts: general + support)
  end

  def specialist_groups(notes)
    mapping = Catalogue.specialist_types.fetch(@s.category, {})
    @s.specialists.filter_map do |type|
      ids = mapping[type]
      unless ids
        notes << "No #{type.downcase} specialist layouts in the #{@category['label'].downcase} documents."
        next
      end
      sheets = ids.filter_map { |id| @sheets.find { |l| l.id == id } }
      Group.new(key: "specialist-#{type.parameterize}", label: "Specialist teaching — #{type}", note: nil, layouts: sheets)
    end
  end

  def roll_group(space)
    sheets = @sheets.select { |l| l.space == space }
    label = space == "library" ? "Library" : "Administration"
    return [Group.new(key: space, label:, note: "No roll given, so all layouts are shown.", layouts: sheets), [], nil] unless @s.roll

    fits, out = sheets.partition { |l| l.roll_fits?(@s.roll) }
    excluded = out.map { |l| { layout: l, reason: "Designed for #{l.occupancy}; the projected roll is #{@s.roll}." } }
    note = if fits.empty? && sheets.any?
      "No standard #{label.downcase} layout covers a projected roll of #{@s.roll}."
    end
    unbanded = fits.none?(&:roll_band) && fits.any?
    group_note = unbanded ? "These layouts state staff numbers rather than a student roll, so they are not filtered by roll." : "Filtered to a projected roll of #{@s.roll}."
    [Group.new(key: space, label:, note: group_note, layouts: fits), excluded, note]
  end
end
