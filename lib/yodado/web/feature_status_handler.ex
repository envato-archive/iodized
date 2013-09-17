defmodule Yodado.Web.FeatureStatusHandler do
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
    {feature_id, req} = :cowboy_req.binding(:feature_id, req)
    state = Keyword.put(state, :feature_id, feature_id)
    case Yodado.FeaturePersistence.find_feature(feature_id) do
      :not_found ->     {false, req, state}
      {:ok, feature} -> state = Keyword.put(state, :feature, feature)
                        {true, req, state}
    end
  end

  def content_types_provided(req, state) do
    providers = [
      {"*", :render_feature_state}
    ]

    {providers, req, state}
  end

  def render_feature_state(req, state) do
    {params, req} = :cowboy_req.qs_vals(req)

    req = :cowboy_req.set_resp_header("content-type", "application/json; charset=utf-8", req)

    {:ok, result} = Yodado.Feature.do?(state[:feature], params)

    body = [status: result] |> JSEX.encode!

    {body, req, state}
  end

end
