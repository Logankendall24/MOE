class SchoolType < ApplicationRecord
  has_and_belongs_to_many :building_types
  has_many :requirements, dependent: :restrict_with_error

  validates :code, presence: true, uniqueness: true
  validates :label, presence: true
end
