class BuildingTypesController < ApplicationController
  def index
    @building_types = BuildingType.includes(:school_types, :sources).order(:category, :code)
    @grouped = @building_types.group_by(&:category)
  end

  def show
    @building_type = BuildingType.includes(:school_types, :sources, :rules, layouts: :spaces)
                                  .find_by!(code: params[:id].to_s.upcase)
  end
end
