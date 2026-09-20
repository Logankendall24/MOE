class QuestionnaireController < ApplicationController
  STEPS = %w[school-type rolls teaching-spaces facilities configuration site].freeze

  STEP_INFO = {
    "school-type" => {
      title: "School type",
      why: "Ministry standard designs and layouts differ for primary, intermediate, secondary, and kura settings, so this determines which options are shown to you at all."
    },
    "rolls" => {
      title: "Student roll",
      why: "Roll numbers help frame how many teaching spaces your school is likely to need. Exact Ministry sizing formulas still need to be confirmed against source PDFs, so this informs your summary rather than driving an automatic match yet."
    },
    "teaching-spaces" => {
      title: "Teaching spaces required",
      why: "Compared against each standard building type's documented teaching-space capacity, where that figure has been confirmed."
    },
    "facilities" => {
      title: "Facilities required",
      why: "Selects which categories of standard design — library, hall, gym, and so on — are relevant to what you're planning. Teaching spaces are always included."
    },
    "configuration" => {
      title: "Building configuration",
      why: "Some standard designs may support single- or two-storey configurations. This is only shown as a match once it's confirmed against Ministry documentation."
    },
    "site" => {
      title: "Site & constraints",
      why: "Captured for your summary. This prototype doesn't yet automatically evaluate site constraints against building footprints."
    }
  }.freeze

  before_action :set_step, only: %i[show update]

  def start
    session[:requirement_draft] = {}
    redirect_to questionnaire_step_path(STEPS.first)
  end

  def show
    @draft = draft
    @step_info = STEP_INFO.fetch(@step)
  end

  def update
    draft.merge!(step_params)
    session[:requirement_draft] = draft

    if @step == STEPS.last
      if persist_requirement!
        session[:requirement_draft] = nil
        redirect_to results_path
      else
        redirect_to questionnaire_step_path(STEPS.first),
                    alert: "Something in your answers was incomplete — please go through the questions again."
      end
    else
      redirect_to questionnaire_step_path(next_step)
    end
  end

  private

  def set_step
    @step = params[:step]
    unless STEPS.include?(@step)
      redirect_to questionnaire_start_path
    end
  end

  def next_step
    STEPS[STEPS.index(@step) + 1]
  end

  def draft
    session[:requirement_draft] ||= {}
  end

  def step_params
    case @step
    when "school-type"
      { "school_type_code" => params.dig(:draft, :school_type_code) }
    when "rolls"
      { "current_roll" => params.dig(:draft, :current_roll), "projected_roll" => params.dig(:draft, :projected_roll) }
    when "teaching-spaces"
      {
        "teaching_spaces_required" => params.dig(:draft, :teaching_spaces_required),
        "specialist_spaces_required" => params.dig(:draft, :specialist_spaces_required)
      }
    when "facilities"
      { "facilities" => Array(params.dig(:draft, :facilities)).reject(&:blank?) }
    when "configuration"
      { "configuration_preference" => params.dig(:draft, :configuration_preference) }
    when "site"
      { "site_notes" => params.dig(:draft, :site_notes) }
    else
      {}
    end
  end

  def persist_requirement!
    school_type = SchoolType.find_by(code: draft["school_type_code"])
    return false unless school_type

    token = session[:requirement_token] ||= SecureRandom.uuid
    facilities = (Array(draft["facilities"]) + ["teaching"]).uniq

    Requirement.create!(
      school_type: school_type,
      current_roll: draft["current_roll"].presence,
      projected_roll: draft["projected_roll"].presence,
      teaching_spaces_required: draft["teaching_spaces_required"].presence,
      specialist_spaces_required: draft["specialist_spaces_required"].presence,
      facilities_requested: facilities,
      configuration_preference: draft["configuration_preference"].presence || "no_preference",
      site_notes: draft["site_notes"],
      session_token: token
    )
    true
  rescue ActiveRecord::RecordInvalid
    false
  end
end
