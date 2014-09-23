defmodule Iodized.WebhookPersistence.Mnesia do

  @table :webhook

  def all() do
    id_wildcard = webhook_wildcard = :_
    match = {@table, id_wildcard, webhook_wildcard}
    webhooks = :mnesia.dirty_match_object(match) |>
      Enum.map(fn({@table, _id, webhook}) -> webhook end)
    {:ok, webhooks}
  end

  def save_webhook(webhook) do
    {:atomic, :ok} = :mnesia.transaction(fn() ->
                                           :mnesia.write({@table, webhook.id, webhook})
                                         end)
    {:ok, true}
  end

  def delete_webhook(id) do
    {:atomic, :ok} = :mnesia.transaction(fn() ->
      :mnesia.delete({@table, id})
    end)
    {:ok, true}
  end

  def find_webhook(id) do
    webhook = :mnesia.dirty_read(@table, id)
    case webhook do
      [{@table, _id, webhook}] -> {:ok, webhook}
      [] -> :not_found
    end
  end

end
