class SupportRequest < ApplicationRecord
  belongs_to :service, optional: true

  validates :full_name, presence: true
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :requester_type, presence: true
  validates :support_type, presence: true
  validates :preferred_contact_method, presence: true
  validates :message, presence: true
  validates :consent, acceptance: true
  validates :status, presence: true

  before_validation :set_default_status, on: :create

  def reference
    "SR-#{format('%04d', id)}"
  end

  private

  def set_default_status
    self.status ||= "new"
  end
end
