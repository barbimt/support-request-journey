module Api
  class ServicesController < ApplicationController
    before_action :set_service, only: %i[show update destroy]

    def index
      services = Service.order(:title)
      render json: services
    end

    def show
      render json: @service
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

    def update
      if @service.update(service_params)
        render json: @service
      else
        render json: {
          message: "There are validation errors.",
          errors: @service.errors.to_hash
        }, status: :unprocessable_entity
      end
    end

    def destroy
      if @service.destroy
        head :no_content
      else
        render json: { message: "Unable to delete service." }, status: :unprocessable_entity
      end
    end

    private

    def set_service
      @service = Service.find_by(id: params[:id])

      return if @service

      render json: { message: "Service not found" }, status: :not_found
    end

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
