class CreateSchoolTypes < ActiveRecord::Migration[8.1]
  def change
    create_table :school_types do |t|
      t.string :code
      t.string :label
      t.text :notes

      t.timestamps
    end
    add_index :school_types, :code, unique: true
  end
end
