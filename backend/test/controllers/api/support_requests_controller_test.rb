require "test_helper"

module Api
  class SupportRequestsControllerTest < ActionDispatch::IntegrationTest
    test "create returns 201 with valid params" do
      service = services(:family_support)

      assert_difference "SupportRequest.count", 1 do
        post api_support_requests_url, params: {
          support_request: valid_attributes(service_id: service.id)
        }, as: :json
      end

      assert_response :created

      body = JSON.parse(response.body)
      assert_equal "Your support request has been submitted.", body["message"]
      assert_match(/\ASR-\d{4}\z/, body["reference"])
      assert_equal "Jordan Lee", body["support_request"]["full_name"]
    end

    test "create returns 422 with validation errors" do
      assert_no_difference "SupportRequest.count" do
        post api_support_requests_url, params: {
          support_request: { full_name: "" }
        }, as: :json
      end

      assert_response :unprocessable_entity

      body = JSON.parse(response.body)
      assert_equal "There are validation errors.", body["message"]
      assert body["errors"].key?("full_name")
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
end
