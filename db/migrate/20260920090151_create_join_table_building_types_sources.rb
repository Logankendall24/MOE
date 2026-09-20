class CreateJoinTableBuildingTypesSources < ActiveRecord::Migration[8.1]
  def change
    create_join_table :building_types, :sources do |t|
      t.index [:building_type_id, :source_id], unique: true
    end
  end
end
