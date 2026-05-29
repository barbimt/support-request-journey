class CreateSupportRequests < ActiveRecord::Migration[8.1]
  def change
    create_table :support_requests do |t|
      t.string :full_name
      t.string :email
      t.string :phone
      t.string :requester_type
      t.string :support_type
      t.string :preferred_contact_method
      t.text :message
      t.boolean :consent
      t.string :status
      t.references :service, null: true, foreign_key: true

      t.timestamps
    end
  end
end
