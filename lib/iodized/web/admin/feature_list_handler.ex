defmodule Iodized.Web.Admin.FeatureListHandler do

  @persistence Iodized.FeaturePersistence.Mnesia

  def init(_transport, _req, _opts) do
    {:upgrade, :protocol, :cowboy_rest}
  end

  def rest_init(req, _opts) do
    {:ok, req, :undefined}
  end

  def allowed_methods(req, state) do
    {["GET", "PUT"], req, state}
  end

  def content_types_provided(req, state) do
    providers = [
      {"*", :render_feature_list}
    ]
    {providers, req, state}
  end

  def render_feature_list(req, state) do
    req = :cowboy_req.set_resp_header("content-type", "application/json; charset=utf-8", req)
    {:ok, features} = @persistence.all()
    body = features |> Enum.map(&Iodized.Feature.json/1) |> JSEX.encode!(indent: 2)
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
                Enum.map(&Iodized.Feature.from_json/1) |>
                @persistence.sync()
    {true, req, state}
  end
end
