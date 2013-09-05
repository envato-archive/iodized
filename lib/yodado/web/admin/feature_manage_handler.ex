defmodule Yodado.Web.Admin.FeatureStatusHandler do
  def init(_transport, _req, _opts) do
    {:upgrade, :protocol, :cowboy_rest}
  end

  def rest_init(req, opts) do
    {:ok, req, []}
  end

  def allowed_methods(req, state) do
    {["GET", "PUT", "DELETE"], req, state}
  end

  def service_available(req, state) do
    persistence_ok = Yodado.FeaturePersistence.ping
    {persistence_ok, req, state}
  end

  def resource_exists(req, state) do
    {feature_id, req} = :cowboy_req.binding(:feature_id, req)
    case Yodado.FeaturePersistence.find_feature(feature_id) do
      :not_found ->     {false, req, state}
      {:ok, feature} -> state = Keyword.put(state, :feature, feature)
                        {true, req, state}
    end
  end

  def content_types_provided(req, state) do
    providers = [
      {"*", :render_feature}
    ]
    {providers, req, state}
  end

  def render_feature(req, state) do
    req = :cowboy_req.set_resp_header("content-type", "application/json; charset=utf-8", req)
    body = state[:feature] |> Yodado.Feature.json |> JSEX.encode!(indent: 2)
    {body, req, state}
  end

  def content_types_accepted(req, state) do
    acceptors = [
      {"application/json", :save_feature}
    ]
    {acceptors, req, state}
  end

  def save_feature(req, state) do
    {:ok, feature_json, req} = :cowboy_req.body(req)
    feature = feature_json |> JSEX.decode!(labels: :atom) |> Yodado.Feature.from_json
    Yodado.FeaturePersistence.save_feature(feature)
    {true, req, state}
  end

  def delete_resource(req, state) do
    {feature_id, req} = :cowboy_req.binding(:feature_id, req)
    Yodado.FeaturePersistence.delete_feature(feature_id)
    {true, req, state}
  end
end
