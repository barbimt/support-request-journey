# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_05_28_134912) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "services", force: :cascade do |t|
    t.text "accessibility_notes"
    t.string "category"
    t.string "contact_email"
    t.datetime "created_at", null: false
    t.text "description"
    t.text "eligibility"
    t.boolean "online_support"
    t.string "opening_hours"
    t.string "phone"
    t.string "title"
    t.datetime "updated_at", null: false
  end

  create_table "support_requests", force: :cascade do |t|
    t.boolean "consent"
    t.datetime "created_at", null: false
    t.string "email"
    t.string "full_name"
    t.text "message"
    t.string "phone"
    t.string "preferred_contact_method"
    t.string "requester_type"
    t.bigint "service_id"
    t.string "status"
    t.string "support_type"
    t.datetime "updated_at", null: false
    t.index ["service_id"], name: "index_support_requests_on_service_id"
  end

  add_foreign_key "support_requests", "services"
end
