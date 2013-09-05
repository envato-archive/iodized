defmodule Yodado.Web.Admin.FeatureStatusHandler do
  def init(_transport, _req, _opts) do
    {:upgrade, :protocol, :cowboy_rest}
  end

  def allowed_methods(req, state) do
    {["GET", "PUT", "DELETE"], req, state}
  end

  def content_types_provided(req, state) do
    providers = [
      {'*', :render_feature}
    ]
    {providers, req, state}
  end

  def render_feature(req, state) do
    # TODO talk to redis, and get feature data
    raise "not implemented"
  end

  def content_types_accepted(req, state) do
    acceptors = [
      {'application/json', :save_feature}
    ]
    {acceptors, req, state}
  end

  def save_feature(req, state) do
    # TODO talk to redis, and save feature data
    raise "not implemented"
  end

  def delete_resource(req, state) do
    # TODO talk to redis and nuke
    raise "not implemented"
  end

  def resource_exists(req, state) do
    # TODO talk to redis, and do lookup and populate
    raise "not implemented"
  end

  def service_available(req, state) do
    # TODO
    raise "not implemented"
  end
end
