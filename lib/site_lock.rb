require "rack/auth/basic"

# Password-protects the whole site, static files included, while it's
# unfinished. The login comes from SITE_USERNAME and SITE_PASSWORD (set as Fly
# secrets). If either is missing the site refuses every request rather than
# opening up. /up stays open so Fly's health check still works.
#
# To make the site public again, remove the SiteLock line in
# config/environments/production.rb.
class SiteLock
  REALM = "Standard designs selector".freeze
  OPEN_PATHS = %w[/up].freeze

  def initialize(app, username: ENV["SITE_USERNAME"], password: ENV["SITE_PASSWORD"])
    @app = app
    user, pass = username.to_s, password.to_s
    @locked = user.empty? || pass.empty?
    @auth = Rack::Auth::Basic.new(app, REALM) do |u, p|
      ActiveSupport::SecurityUtils.secure_compare(u, user) & ActiveSupport::SecurityUtils.secure_compare(p, pass)
    end
  end

  def call(env)
    return @app.call(env) if OPEN_PATHS.include?(env["PATH_INFO"])
    return [503, { "content-type" => "text/plain", "x-robots-tag" => "noindex, nofollow" }, ["This site is private.\n"]] if @locked

    status, headers, body = @auth.call(env)
    headers["x-robots-tag"] = "noindex, nofollow"
    [status, headers, body]
  end
end
