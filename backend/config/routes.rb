Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    resources :services, only: %i[index show create update destroy]
    resources :support_requests, only: %i[create]
  end
end
