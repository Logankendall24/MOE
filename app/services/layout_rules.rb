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
  Selection = Data.define(:category, :kind, :buildings, :specialists, :roll, :building_type) do
    # kind: the building the user is looking at — teaching, library or admin.
    # building_type: its type id from the option engine (R, S1–S3, D1–D3).
    def initialize(building_type: nil, **rest) = super(building_type:, **rest)
    def in_scope?(space) = buildings.include?(space)
  end

  # The general-teaching module classes for a building type in a category:
  # categories.yml keys them by the type id's first letter, "*" for the rest.
  def self.teaching_modules(category, building_type)
    by_type = Catalogue.categories.dig(category, "teaching_modules") || {}
    by_type[building_type.to_s[0]] || by_type.fetch("*", [])
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
      groups << specialist_group(notes)
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

  # One line for the standard (general teaching) layouts, in the module the
  # building type uses, with the building's support-module sheets.
  def teaching_group
    modules = self.class.teaching_modules(@s.category, @s.building_type)
    general = @sheets.select { |l| l.space == "teaching" && modules.include?(l.module_class) }
    support = @sheets.select { |l| l.space == "support" }
    sizes = modules.map { |m| "module #{m} · #{Catalogue.modules.dig(m, 'size')}" }.join(", ")
    Group.new(key: "standard", label: "Standard layouts", note: sizes, layouts: general + support)
  end

  # One line for the specialist spaces the user selected: each space's own
  # sheets, then the supporting rooms it uses, without repeats.
  def specialist_group(notes)
    spaces = Catalogue.specialist_types.fetch(@s.category, {})
    ids = @s.specialists.flat_map do |name|
      space = spaces[name]
      next space.fetch("sheets") + (space["supporting"] || []) if space
      notes << "No #{name} specialist layouts in the #{@category['label'].downcase} documents."
      []
    end
    sheets = ids.uniq.filter_map { |id| @sheets.find { |l| l.id == id } }
    Group.new(key: "specialist", label: "Specialist teaching spaces", note: @s.specialists.join(" · "), layouts: sheets)
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
