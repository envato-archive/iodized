defmodule Iodized.Web.TryHandler do
  def init(_transport, req, _opts), do: {:ok, req, :undefined}

  def handle(req, state) do
    {:ok, req} = :cowboy_req.reply(404, [], "Do, or do not. There is no try.\n", req)
    {:ok, req, state}
  end

  def terminate(_reason, _req, _state), do: :ok
end
