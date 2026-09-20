class CreateLayouts < ActiveRecord::Migration[8.1]
  def change
    create_table :layouts do |t|
      t.string :name
      t.text :notes
      t.references :building_type, null: false, foreign_key: true

      t.timestamps
    end
  end
end
