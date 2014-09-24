defmodule Iodized.Web.Admin.WebhookListHandler do

  @persistence Iodized.WebhookPersistence.Mnesia

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
      {{"application", "json", :*}, :render_webhook_list}
    ]
    {providers, req, state}
  end

  def render_webhook_list(req, state) do
    req = :cowboy_req.set_resp_header("content-type", "application/json; charset=utf-8", req)
    {:ok, webhooks} = @persistence.all()
    body = webhooks |> Enum.map(&Iodized.Webhook.json/1) |> JSEX.encode!(indent: 2)
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
    webhook = webhook_json |>
      JSEX.decode!(labels: :atom) |>
      Iodized.Webhook.from_json
    id = UUID.uuid4
    webhook = %{webhook | id: id}

    {:ok, true} = @persistence.save_webhook(webhook)

    body = webhook |> Iodized.Webhook.json |> JSEX.encode!(indent: 2)
    req = :cowboy_req.set_resp_body(body, req)

    {true, req, state}
  end


end
