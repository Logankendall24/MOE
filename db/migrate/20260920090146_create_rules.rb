class CreateRules < ActiveRecord::Migration[8.1]
  def change
    create_table :rules do |t|
      t.text :description
      t.text :condition
      t.string :status, default: "prototype_placeholder", null: false
      t.references :building_type, null: false, foreign_key: true
      t.references :source, null: true, foreign_key: true

      t.timestamps
    end
  end
end
