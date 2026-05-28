module Api
  class SupportRequestsController < ApplicationController
    def create
      support_request = SupportRequest.new(support_request_params)

      if support_request.save
        render json: {
          message: "Your support request has been submitted.",
          reference: support_request.reference,
          support_request: support_request
        }, status: :created
      else
        render json: {
          message: "There are validation errors.",
          errors: support_request.errors.to_hash
        }, status: :unprocessable_entity
      end
    end

    private

    def support_request_params
      params.require(:support_request).permit(
        :full_name,
        :email,
        :phone,
        :requester_type,
        :support_type,
        :preferred_contact_method,
        :message,
        :consent,
        :service_id
      )
    end
  end
end
