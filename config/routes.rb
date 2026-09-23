Rails.application.routes.draw do
  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  get "up" => "rails/health#show", as: :rails_health_check

  # The imported design is the app's front end.
  root "selector#show"

  # Standard-design catalogue: content and filtered layouts for the design's
  # interface, plus diagrams and source PDFs rendered from docs/source-pdfs.
  namespace :api do
    get "catalogue/about", to: "catalogue#about"
    get "catalogue/building", to: "catalogue#building"
  end
  get "catalogue/sheets/:source/:page/:size", to: "catalogue_images#sheet", as: :catalogue_sheet,
      constraints: { page: /\d+/, size: /thumb|full/ }
  get "catalogue/crops/:category/:crop", to: "catalogue_images#crop", as: :catalogue_crop
  get "catalogue/documents/:source", to: "catalogue_documents#show", as: :catalogue_document

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
