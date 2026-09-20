class CreateSources < ActiveRecord::Migration[8.1]
  def change
    create_table :sources do |t|
      t.string :document_name
      t.string :ministry_source_url
      t.integer :page
      t.string :section
      t.string :version_label
      t.string :file_path

      t.timestamps
    end
  end
end
