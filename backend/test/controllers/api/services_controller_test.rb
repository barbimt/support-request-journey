require "test_helper"

module Api
  class ServicesControllerTest < ActionDispatch::IntegrationTest
    test "index returns services ordered by title" do
      get api_services_url

      assert_response :success

      body = JSON.parse(response.body)
      titles = body.map { |service| service["title"] }

      assert_equal titles.sort, titles
      assert_includes titles, services(:housing_advice).title
    end

    test "show returns a service" do
      service = services(:housing_advice)

      get api_service_url(service)

      assert_response :success
      assert_equal service.title, JSON.parse(response.body)["title"]
    end

    test "show returns 404 when service is missing" do
      get api_service_url(id: 999_999)

      assert_response :not_found
      assert_equal "Service not found", JSON.parse(response.body)["message"]
    end

    test "create returns 201 with valid params" do
      assert_difference "Service.count", 1 do
        post api_services_url, params: {
          service: {
            title: "Community wellbeing drop-in",
            category: "mental-health",
            description: "Weekly drop-in sessions with trained wellbeing advisors."
          }
        }, as: :json
      end

      assert_response :created
      assert_equal "Community wellbeing drop-in", JSON.parse(response.body)["title"]
    end

    test "create returns 422 with validation errors" do
      assert_no_difference "Service.count" do
        post api_services_url, params: { service: { title: "" } }, as: :json
      end

      assert_response :unprocessable_entity

      body = JSON.parse(response.body)
      assert_equal "There are validation errors.", body["message"]
      assert body["errors"].key?("title")
    end

    test "update returns updated service with valid params" do
      service = services(:housing_advice)

      patch api_service_url(service), params: {
        service: {
          title: "Updated housing advice",
          category: service.category,
          description: service.description
        }
      }, as: :json

      assert_response :success
      assert_equal "Updated housing advice", JSON.parse(response.body)["title"]
      assert_equal "Updated housing advice", service.reload.title
    end

    test "update returns 404 when service is missing" do
      patch api_service_url(id: 999_999), params: {
        service: { title: "Missing service" }
      }, as: :json

      assert_response :not_found
      assert_equal "Service not found", JSON.parse(response.body)["message"]
    end

    test "update returns 422 with validation errors" do
      service = services(:housing_advice)

      patch api_service_url(service), params: {
        service: { title: "" }
      }, as: :json

      assert_response :unprocessable_entity

      body = JSON.parse(response.body)
      assert_equal "There are validation errors.", body["message"]
      assert body["errors"].key?("title")
    end

    test "destroy removes the service" do
      service = services(:family_support)

      assert_difference "Service.count", -1 do
        delete api_service_url(service)
      end

      assert_response :no_content
    end

    test "destroy returns 404 when service is missing" do
      delete api_service_url(id: 999_999)

      assert_response :not_found
      assert_equal "Service not found", JSON.parse(response.body)["message"]
    end

    test "update returns 400 when service wrapper is missing" do
      service = services(:housing_advice)
      original_title = service.title

      patch api_service_url(service), params: {}, as: :json

      assert_response :bad_request
      assert_includes JSON.parse(response.body)["message"], "service"
      assert_equal original_title, service.reload.title
    end
  end
end
