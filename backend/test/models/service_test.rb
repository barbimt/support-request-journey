require "test_helper"

class ServiceTest < ActiveSupport::TestCase
  test "is valid with required attributes" do
    service = Service.new(
      title: "Community wellbeing drop-in",
      category: "mental-health",
      description: "Weekly drop-in sessions with trained wellbeing advisors."
    )

    assert service.valid?
  end

  test "requires title, category, and description" do
    service = Service.new

    assert_not service.valid?
    assert_includes service.errors[:title], "can't be blank"
    assert_includes service.errors[:category], "can't be blank"
    assert_includes service.errors[:description], "can't be blank"
  end

  test "nullifies linked support requests when destroyed" do
    service = services(:housing_advice)
    support_request = SupportRequest.create!(valid_support_request_attributes(service_id: service.id))

    assert_difference "Service.count", -1 do
      service.destroy
    end

    support_request.reload
    assert_nil support_request.service_id
  end

  private

  def valid_support_request_attributes(overrides = {})
    {
      full_name: "Jordan Lee",
      email: "jordan@example.com",
      requester_type: "myself",
      support_type: "family",
      preferred_contact_method: "email",
      message: "We would like information about local family support groups.",
      consent: true
    }.merge(overrides)
  end
end
