require "test_helper"
require "site_lock"

class SiteLockTest < ActiveSupport::TestCase
  APP = ->(_env) { [200, { "content-type" => "text/plain" }, ["ok"]] }

  def request(lock, path, user: nil, pass: nil)
    headers = user ? { "HTTP_AUTHORIZATION" => "Basic " + ["#{user}:#{pass}"].pack("m0") } : {}
    Rack::MockRequest.new(lock).get(path, headers)
  end

  test "asks for a login without credentials" do
    res = request(SiteLock.new(APP, username: "moe", password: "secret"), "/")
    assert_equal 401, res.status
    assert_equal "noindex, nofollow", res.headers["x-robots-tag"]
  end

  test "rejects a wrong password and accepts the right one" do
    lock = SiteLock.new(APP, username: "moe", password: "secret")
    assert_equal 401, request(lock, "/design/app.js", user: "moe", pass: "wrong").status
    assert_equal 200, request(lock, "/design/app.js", user: "moe", pass: "secret").status
  end

  test "refuses everything when no login is configured" do
    lock = SiteLock.new(APP, username: "", password: nil)
    assert_equal 503, request(lock, "/").status
    assert_equal 503, request(lock, "/", user: "", pass: "").status
  end

  test "leaves the health check open" do
    assert_equal 200, request(SiteLock.new(APP, username: nil, password: nil), "/up").status
  end
end
