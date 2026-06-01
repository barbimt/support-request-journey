class ApplicationController < ActionController::API
  rescue_from ActionController::ParameterMissing do |exception|
    render json: { message: exception.message }, status: :bad_request
  end
end
