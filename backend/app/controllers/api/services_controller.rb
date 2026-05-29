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
  end
end
