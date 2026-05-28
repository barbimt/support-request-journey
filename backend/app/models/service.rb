class Service < ApplicationRecord
  has_many :support_requests, dependent: :nullify

  validates :title, presence: true
  validates :category, presence: true
  validates :description, presence: true
end
