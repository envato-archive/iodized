defmodule Iodized.WebhookPersistence.Mnesia do

  @table :webhook

  @webhook_id 1

  def save_webhooks(webhooks) do
    IO.puts "Writing out webhooks"

    {:atomic, :ok} = :mnesia.transaction(fn() ->
                                           :mnesia.write({@table, @webhook_id, webhooks})
                                         end)
    {:ok, true}
  end

  def delete_webhooks() do
    {:atomic, :ok} = :mnesia.transaction(fn() ->
      :mnesia.delete({@table, @webhook_id})
    end)
    {:ok, true}
  end

  def load_webhooks() do
    webhooks = :mnesia.dirty_read(@table, @webhook_id)
    case webhooks do
      [{@table, _id, webhooks}] ->
        {:ok, webhooks}
      [] ->
        :not_found
    end
  end

end
