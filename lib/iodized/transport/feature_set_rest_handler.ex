defmodule Iodized.Transport.FeatureSetRestHandler do
  @persistence Iodized.FeaturePersistence.Mnesia

  def init(_transport, _req, _opts) do
    {:upgrade, :protocol, :cowboy_rest}
  end

  def rest_init(req, _opts) do
    {:ok, req, :no_state}
  end

  def allowed_methods(req, state) do
    {["GET"], req, state}
  end

  def content_types_provided(req, state) do
    providers = [{{"application", "json", :*}, :render_feature_state}]
    {providers, req, state}
  end

  def render_feature_state(req, state) do
    {params, req} = :cowboy_req.qs_vals(req)
    req = :cowboy_req.set_resp_header("content-type", "application/json; charset=utf-8", req)
    {:ok, features} = @persistence.all
    body = [features: Iodized.FeatureSet.multi_do(features, params)] |> JSEX.encode!
    {body, req, state}
  end
end
