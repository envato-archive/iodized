defmodule Yodado.Web.FeatureStatusHandler do
  def init(_transport, _req, _opts) do
    {:upgrade, :protocol, :cowboy_rest}
  end

  def allowed_methods(req, state) do
    {["GET"], req, state}
  end

  def content_types_provided(req, state) do
    providers = [
      {"*", :render_feature_state}
    ]

    {providers, req, state}
  end

  def resource_exists(req, state) do
    {true, req, state}
  end

  def render_feature_state(req, state) do
    body = """
    {
      "state" : true
    }
    """
    req = :cowboy_req.set_resp_header("content-type", "application/json; charset=utf-8", req)
    {body, req, state}
  end

end
