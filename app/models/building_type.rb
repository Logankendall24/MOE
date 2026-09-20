class BuildingType < ApplicationRecord
  CATEGORIES = %w[teaching administration library hall gym specialist learning_support].freeze
  STATUSES = %w[prototype_placeholder verified].freeze

  has_and_belongs_to_many :school_types
  has_and_belongs_to_many :sources
  has_many :layouts, dependent: :destroy
  has_many :rules, dependent: :destroy

  validates :code, presence: true, uniqueness: true
  validates :name, presence: true
  validates :category, inclusion: { in: CATEGORIES }, allow_nil: true
  validates :status, inclusion: { in: STATUSES }

  serialize :storeys_supported, coder: JsonColumnCoder
  serialize :fixed_elements, coder: JsonColumnCoder
  serialize :configurable_elements, coder: JsonColumnCoder

  def prototype_placeholder?
    status == "prototype_placeholder"
  end

  def to_param
    code
  end

  CATEGORY_LABELS = {
    "teaching" => "Teaching",
    "administration" => "Administration",
    "library" => "Library",
    "hall" => "Hall",
    "gym" => "Gym",
    "specialist" => "Specialist teaching",
    "learning_support" => "Learning support"
  }.freeze

  def category_label
    CATEGORY_LABELS.fetch(category, "Category not yet confirmed")
  end
end
