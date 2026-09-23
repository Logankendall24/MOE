Rails.application.routes.draw do
  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  get "up" => "rails/health#show", as: :rails_health_check

  # The imported design is the app's front end.
  root "selector#show"

  # Phase 1 server-rendered screens. Superseded by the design for
  # primary/intermediate, but kept routed — they still cover secondary, halls
  # and gyms, which the design has no screens for yet.
  get "legacy", to: "home#index", as: :legacy_home
  get "start", to: "questionnaire#start", as: :questionnaire_start
  get "questionnaire/:step", to: "questionnaire#show", as: :questionnaire_step,
      constraints: { step: /school-type|rolls|teaching-spaces|facilities|configuration|site/ }
  patch "questionnaire/:step", to: "questionnaire#update"

  get "results", to: "results#show"

  resources :building_types, only: %i[index show]
end
