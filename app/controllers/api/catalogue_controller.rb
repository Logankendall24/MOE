module Api
  # JSON for the design's interface. The interface keeps the user's selections;
  # these endpoints decide what catalogue content and layouts go with them.
  class CatalogueController < ApplicationController
    BUILDINGS = %w[teaching admin library gym hall support].freeze

    before_action :require_category

    def about
      render json: CataloguePresenter.new(params[:category]).about
    end

    def building
      render json: CataloguePresenter.new(params[:category]).building(
        building_type: params[:type].to_s,
        buildings: Array(params[:buildings]).map(&:to_s) & BUILDINGS,
        specialists: Array(params[:specialists]).map(&:to_s),
        roll: Integer(params[:roll], exception: false),
        climate_zone: params[:zone].to_s[/\A[1-6]\z/] || "3",
        layout: params[:layout].to_s[/\A[A-D]\z/]
      )
    end

    private

    def require_category
      render json: { error: "Unknown category" }, status: :bad_request unless Catalogue.category?(params[:category].to_s)
    end
  end
end
