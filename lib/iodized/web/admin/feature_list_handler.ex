defmodule Iodized.Web.Admin.FeatureListHandler do

  @persistence Iodized.FeaturePersistence.Mnesia

  def init(_transport, _req, _opts) do
    {:upgrade, :protocol, :cowboy_rest}
  end

  def rest_init(req, _opts) do
    {:ok, req, :undefined}
  end

  def allowed_methods(req, state) do
    {["GET", "POST"], req, state}
  end

  def content_types_provided(req, state) do
    providers = [
      {{"application", "json", :*}, :render_feature_list}
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
      {{"application", "json", :*}, :save_feature}
    ]
    {acceptors, req, state}
  end

  def save_feature(req, state) do
    {:ok, feature_json, req} = :cowboy_req.body(req)
    feature = feature_json |>
      JSEX.decode!(labels: :atom) |>
      Iodized.Feature.from_json
    id = :uuid.to_string(:uuid.uuid4)
    feature = feature.id(id)

    {:ok, true} = @persistence.save_feature(feature)

    {url, req} = :cowboy_req.url(req)
    {{true, "#{url}/#{id}"}, req, state}
  end
end
