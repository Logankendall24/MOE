class CreateBuildingTypes < ActiveRecord::Migration[8.1]
  def change
    create_table :building_types do |t|
      t.string :code
      t.string :name
      t.string :category
      t.string :depth
      t.text :storeys_supported
      t.integer :teaching_space_min
      t.integer :teaching_space_max
      t.boolean :admin_compatible
      t.boolean :hall_gym_compatible
      t.text :fixed_elements
      t.text :configurable_elements
      t.text :summary
      t.string :status, default: "prototype_placeholder", null: false

      t.timestamps
    end
    add_index :building_types, :code, unique: true
    add_index :building_types, :category
  end
end
