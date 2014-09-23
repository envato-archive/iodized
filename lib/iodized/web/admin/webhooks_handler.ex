require IEx

defmodule Iodized.Web.Admin.WebhooksHandler do
  defstruct webhooks: nil

  @persistence Iodized.WebhookPersistence.Mnesia

  def init(_transport, _req, _opts) do
    {:upgrade, :protocol, :cowboy_rest}
  end

  def rest_init(req, _opts) do
    state = %Iodized.Web.Admin.WebhooksHandler{}
    {:ok, req, state}
  end

  def allowed_methods(req, state) do
    {["PUT", "DELETE", "GET"], req, state}
  end

  def content_types_provided(req, state) do
    providers = [
      {{"application", "json", :*}, :render_webhooks}
    ]
    {providers, req, state}
  end

  def resource_exists(req, state) do
    case @persistence.load_webhooks() do
      :not_found ->     {false, req, state}
      {:ok, webhooks} ->
        state = %{state| webhooks: webhooks}
        {true, req, state}
    end
  end

  def render_webhooks(req, state) do
    req = :cowboy_req.set_resp_header("content-type", "application/json; charset=utf-8", req)
    body = state.webhooks |> JSEX.encode!(indent: 2)
    {body, req, state}
  end

  def content_types_accepted(req, state) do
    acceptors = [
      {{"application", "json", :*}, :update_webhooks}
     ]
    {acceptors, req, state}
  end

  def update_webhooks(req, state) do
    {:ok, hooks_json, req} = :cowboy_req.body(req)
    hooks = hooks_json |> JSEX.decode!(labels: :atom) |> Iodized.Webhooks.from_json
    {:ok, true} = @persistence.save_webhooks(hooks)

    {true, req, state}
  end

  def delete_resource(req, state) do
    @persistence.delete_webhooks()
    {true, req, state}
  end

end
