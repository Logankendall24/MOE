class Source < ApplicationRecord
  has_and_belongs_to_many :building_types
  has_many :rules

  validates :document_name, presence: true

  def citation
    parts = [document_name]
    parts << "p.#{page}" if page.present?
    parts << section if section.present?
    parts.join(" — ")
  end
end
