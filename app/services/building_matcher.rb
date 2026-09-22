# Deterministic, rule-based matching against documented BuildingType attributes.
# No LLM in this path — every reason shown to the user traces back to a specific
# comparison between the Requirement and a BuildingType field, and every field that
# isn't yet Ministry-confirmed shows up as an "unknown" rather than a silent pass.
class BuildingMatcher
  Result = Struct.new(:building_type, :relevant, :reasons, :violations, :unknowns, keyword_init: true) do
    def any_confirmed_evidence?
      reasons.any? || violations.any?
    end
  end

  def initialize(requirement)
    @requirement = requirement
  end

  def call
    candidates.map { |building_type| evaluate(building_type) }
              .sort_by { |r| [r.relevant ? 0 : 1, -r.reasons.size] }
  end

  private

  attr_reader :requirement

  def candidates
    requested = Array(requirement.facilities_requested)
    scope = BuildingType.where(category: requested).or(BuildingType.where(category: nil))
    scope = scope.or(BuildingType.where(admin_compatible: true)) if requested.include?("administration")
    scope
  end

  def evaluate(building_type)
    reasons = []
    violations = []
    unknowns = []

    check_school_type(building_type, reasons, violations, unknowns)
    check_category(building_type, reasons, violations, unknowns)
    check_configuration(building_type, reasons, violations, unknowns)
    check_teaching_space_count(building_type, reasons, violations, unknowns)

    Result.new(
      building_type: building_type,
      relevant: violations.empty?,
      reasons: reasons,
      violations: violations,
      unknowns: unknowns
    )
  end

  def check_school_type(bt, reasons, violations, unknowns)
    return unless requirement.school_type

    if bt.school_types.empty?
      unknowns << "Which school types Type #{bt.code} supports hasn't been confirmed against the Ministry PDFs yet"
    elsif bt.school_types.include?(requirement.school_type)
      reasons << "Documented as applicable to #{requirement.school_type.label} schools"
    else
      violations << "Documented for #{bt.school_types.map(&:label).join(', ')} schools, not #{requirement.school_type.label}"
    end
  end

  def check_category(bt, reasons, violations, unknowns)
    requested = Array(requirement.facilities_requested)

    if bt.category.nil?
      unknowns << "Category (teaching, hall, gym, etc.) for Type #{bt.code} not yet confirmed"
    elsif requested.include?(bt.category)
      reasons << "Matches your requested #{bt.category_label.downcase} facilities"
    end

    if requested.include?("administration") && bt.category != "administration"
      if bt.admin_compatible
        reasons << "Documented as compatible with an attached administration module"
      elsif bt.admin_compatible.nil?
        unknowns << "Whether Type #{bt.code} can accommodate an administration module isn't yet confirmed"
      end
    end
  end

  def check_configuration(bt, reasons, violations, unknowns)
    preference = requirement.configuration_preference
    return if preference.blank? || preference == "no_preference"

    wanted = preference == "single_storey" ? "single" : "two"

    if bt.storeys_supported.blank?
      unknowns << "Storey configuration options for Type #{bt.code} not yet confirmed"
    elsif bt.storeys_supported.include?(wanted)
      reasons << "Supports your requested #{wanted}-storey configuration"
    else
      violations << "Documented storey options (#{bt.storeys_supported.join(', ')}) don't include #{wanted}-storey"
    end
  end

  def check_teaching_space_count(bt, reasons, violations, unknowns)
    return unless bt.category == "teaching"
    return if requirement.teaching_spaces_required.blank?

    if bt.teaching_space_min.blank? && bt.teaching_space_max.blank?
      unknowns << "Documented teaching-space capacity for Type #{bt.code} not yet confirmed"
      return
    end

    required = requirement.teaching_spaces_required
    min = bt.teaching_space_min || 0
    max = bt.teaching_space_max || Float::INFINITY

    if required.between?(min, max)
      reasons << "Documented capacity (#{bt.teaching_space_min}–#{bt.teaching_space_max}) covers your #{required} required teaching spaces"
    else
      violations << "Documented capacity (#{bt.teaching_space_min}–#{bt.teaching_space_max}) doesn't cover your #{required} required teaching spaces"
    end
  end
end
