defmodule Yodado.Web.Admin.FeatureListHandler do

  defrecord State, c: nil

  def init(_transport, _req, _opts) do
    {:upgrade, :protocol, :cowboy_rest}
  end

  def rest_init(req, _opts) do
    state = State.new(c: Yodado.FeaturePersistence.new)
    {:ok, req, state}
  end

  def allowed_methods(req, state) do
    {["GET", "PUT"], req, state}
  end

  def service_available(req, state) do
    persistence_ok = Yodado.FeaturePersistence.ping(state.c)
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
    {:ok, features} = Yodado.FeaturePersistence.all(state.c)
    body = features |> Enum.map(&Yodado.Feature.json/1) |> JSEX.encode!(indent: 2)
    {body, req, state}
  end

  def content_types_accepted(req, state) do
    acceptors = [
      {"application/json", :sync_features}
    ]
    {acceptors, req, state}
  end

  def sync_features(req, state) do
    {:ok, features_json, req} = :cowboy_req.body(req)
    {:ok, true} = features_json |> 
                JSEX.decode!(labels: :atom) |> 
                Enum.map(&Yodado.Feature.from_json/1) |>
                Yodado.FeaturePersistence.sync(state.c)
    {true, req, state}
  end
end
