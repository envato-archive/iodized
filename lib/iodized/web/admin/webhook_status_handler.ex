defmodule Iodized.Web.Admin.WebhookStatusHandler do

  @persistence Iodized.WebhookPersistence.Mnesia

  def init(_transport, _req, _opts) do
    {:upgrade, :protocol, :cowboy_rest}
  end

  def rest_init(req, _opts) do
    state = %{webhook: nil}
    {:ok, req, state}
  end

  def allowed_methods(req, state) do
    {["GET", "PUT", "DELETE"], req, state}
  end

  def resource_exists(req, state) do
    {webhook_id, req} = :cowboy_req.binding(:webhook_id, req)
    case @persistence.find_webhook(webhook_id) do
      :not_found ->     {false, req, state}
      {:ok, webhook} -> state = %{state| webhook: webhook}
                        {true, req, state}
    end
  end

  def content_types_provided(req, state) do
    providers = [
      {{"application", "json", :*}, :render_webhook}
    ]
    {providers, req, state}
  end

  def render_webhook(req, state) do
    req = :cowboy_req.set_resp_header("content-type", "application/json; charset=utf-8", req)
    body = state.webhook |> Iodized.Webhook.json |> JSEX.encode!(indent: 2)
    {body, req, state}
  end

  def content_types_accepted(req, state) do
    acceptors = [
      {{"application", "json", :*}, :save_webhook}
    ]
    {acceptors, req, state}
  end

  def save_webhook(req, state) do
    {:ok, webhook_json, req} = :cowboy_req.body(req)
    webhook = webhook_json |> JSEX.decode!(labels: :atom) |> Iodized.Webhook.from_json
    @persistence.save_webhook(webhook)
    {true, req, state}
  end

  def delete_resource(req, state) do
    {webhook_id, req} = :cowboy_req.binding(:webhook_id, req)
    @persistence.delete_webhook(webhook_id)
    {true, req, state}
  end
end
