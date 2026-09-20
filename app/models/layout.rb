class Layout < ApplicationRecord
  belongs_to :building_type
  has_and_belongs_to_many :spaces

  validates :name, presence: true
end
