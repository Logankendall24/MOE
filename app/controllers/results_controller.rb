class ResultsController < ApplicationController
  def show
    token = session[:requirement_token]
    @requirement = token ? Requirement.where(session_token: token).order(created_at: :desc).first : nil

    if @requirement.nil?
      redirect_to root_path, alert: "Let's start with a few questions about your school first." and return
    end

    @results = BuildingMatcher.new(@requirement).call
    @relevant, @ruled_out = @results.partition(&:relevant)
  end
end
