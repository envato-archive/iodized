defmodule Yodado.Web.Admin.FeatureListHandler do
  def init(_transport, _req, _opts) do
    {:upgrade, :protocol, :cowboy_rest}
  end

  def rest_init(req, _opts) do
    {:ok, req, []}
  end

  def allowed_methods(req, state) do
    {["GET"], req, state}
  end

  def service_available(req, state) do
    persistence_ok = Yodado.FeaturePersistence.ping
    {persistence_ok, req, state}
  end

  def resource_exists(req, state) do
    {true, req, state}
  end

  def content_types_provided(req, state) do
    providers = [
      {"*", :render_feature_list}
    ]
    {providers, req, state}
  end

  def render_feature_list(req, state) do
    req = :cowboy_req.set_resp_header("content-type", "application/json; charset=utf-8", req)
    {:ok, features} = Yodado.FeaturePersistence.all()
    body = features |> Enum.map(&Yodado.Feature.json/1) |> JSEX.encode!(indent: 2)
    {body, req, state}
  end
end
