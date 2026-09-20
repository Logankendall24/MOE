class Requirement < ApplicationRecord
  CONFIGURATIONS = %w[single_storey two_storey no_preference].freeze

  belongs_to :school_type

  serialize :facilities_requested, coder: JsonColumnCoder

  validates :session_token, presence: true
  validates :configuration_preference, inclusion: { in: CONFIGURATIONS }, allow_nil: true

  def facilities_requested
    super || []
  end
end
