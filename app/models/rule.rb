class Rule < ApplicationRecord
  STATUSES = %w[prototype_placeholder verified].freeze

  belongs_to :building_type
  belongs_to :source, optional: true

  validates :description, presence: true
  validates :status, inclusion: { in: STATUSES }

  serialize :condition, coder: JsonColumnCoder

  def prototype_placeholder?
    status == "prototype_placeholder"
  end
end
