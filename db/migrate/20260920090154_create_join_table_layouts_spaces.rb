class CreateJoinTableLayoutsSpaces < ActiveRecord::Migration[8.1]
  def change
    create_join_table :layouts, :spaces do |t|
      t.index [:layout_id, :space_id], unique: true
    end
  end
end
