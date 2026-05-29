require "test_helper"

class SupportRequestTest < ActiveSupport::TestCase
  test "is valid with required attributes" do
    support_request = SupportRequest.new(valid_attributes)

    assert support_request.valid?
  end

  test "requires core fields" do
    support_request = SupportRequest.new

    assert_not support_request.valid?
    assert_includes support_request.errors[:full_name], "can't be blank"
    assert_includes support_request.errors[:email], "can't be blank"
    assert_includes support_request.errors[:requester_type], "can't be blank"
    assert_includes support_request.errors[:support_type], "can't be blank"
    assert_includes support_request.errors[:preferred_contact_method], "can't be blank"
    assert_includes support_request.errors[:message], "can't be blank"
  end

  test "requires consent to be accepted" do
    support_request = SupportRequest.new(valid_attributes(consent: false))

    assert_not support_request.valid?
    assert_includes support_request.errors[:consent], "must be accepted"
  end

  test "rejects invalid email" do
    support_request = SupportRequest.new(valid_attributes(email: "not-an-email"))

    assert_not support_request.valid?
    assert_includes support_request.errors[:email], "is invalid"
  end

  test "sets default status on create" do
    support_request = SupportRequest.create!(valid_attributes)

    assert_equal "new", support_request.status
  end

  test "reference uses zero-padded id" do
    support_request = SupportRequest.create!(valid_attributes)

    assert_equal "SR-#{format('%04d', support_request.id)}", support_request.reference
  end

  test "service is optional" do
    support_request = SupportRequest.new(valid_attributes(service_id: nil))

    assert support_request.valid?
  end

  private

  def valid_attributes(overrides = {})
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
