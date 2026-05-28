class CreateServices < ActiveRecord::Migration[8.1]
  def change
    create_table :services do |t|
      t.string :title
      t.string :category
      t.text :description
      t.text :eligibility
      t.string :contact_email
      t.string :phone
      t.string :opening_hours
      t.text :accessibility_notes
      t.boolean :online_support

      t.timestamps
    end
  end
end
