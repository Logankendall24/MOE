Rails.application.routes.draw do
  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  get "up" => "rails/health#show", as: :rails_health_check

  root "home#index"

  get "start", to: "questionnaire#start", as: :questionnaire_start
  get "questionnaire/:step", to: "questionnaire#show", as: :questionnaire_step,
      constraints: { step: /school-type|rolls|teaching-spaces|facilities|configuration|site/ }
  patch "questionnaire/:step", to: "questionnaire#update"

  get "results", to: "results#show"

  resources :building_types, only: %i[index show]
end
