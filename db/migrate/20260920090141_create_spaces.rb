class CreateSpaces < ActiveRecord::Migration[8.1]
  def change
    create_table :spaces do |t|
      t.string :name
      t.string :category
      t.float :typical_area_m2
      t.text :notes

      t.timestamps
    end
    add_index :spaces, :category
  end
end
