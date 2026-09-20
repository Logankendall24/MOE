class CreateRequirements < ActiveRecord::Migration[8.1]
  def change
    create_table :requirements do |t|
      t.references :school_type, null: false, foreign_key: true
      t.integer :current_roll
      t.integer :projected_roll
      t.integer :teaching_spaces_required
      t.integer :specialist_spaces_required
      t.text :facilities_requested
      t.string :configuration_preference
      t.text :site_notes
      t.string :session_token

      t.timestamps
    end
  end
end
