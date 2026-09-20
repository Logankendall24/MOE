class Space < ApplicationRecord
  has_and_belongs_to_many :layouts

  validates :name, presence: true
  validates :category, inclusion: { in: BuildingType::CATEGORIES }
end
