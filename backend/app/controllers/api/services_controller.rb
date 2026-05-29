module Api
  class ServicesController < ApplicationController
    def index
      services = Service.order(:title)
      render json: services
    end

    def show
      service = Service.find_by(id: params[:id])

      if service
        render json: service
      else
        render json: { message: "Service not found" }, status: :not_found
      end
    end

    def create
      service = Service.new(service_params)

      if service.save
        render json: service, status: :created
      else
        render json: {
          message: "There are validation errors.",
          errors: service.errors.to_hash
        }, status: :unprocessable_entity
      end
    end

    private

    def service_params
      params.require(:service).permit(
        :title,
        :category,
        :description,
        :eligibility,
        :contact_email,
        :phone,
        :opening_hours,
        :accessibility_notes,
        :online_support
      )
    end
  end
end
