class CreateJoinTableBuildingTypesSchoolTypes < ActiveRecord::Migration[8.1]
  def change
    create_join_table :building_types, :school_types do |t|
      t.index [:building_type_id, :school_type_id], unique: true
    end
  end
end
