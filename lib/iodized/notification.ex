defmodule Iodized.Notification do

  @persistence Iodized.WebhookPersistence.Mnesia

  def notify_event(event, message) do
    {:ok, webhooks} = @persistence.all()
    notify_event(event, message, webhooks)
  end

  def notify_event(event, message, webhooks) do

    replace_message = fn url ->
      encoded_message = URI.encode(message)
      String.replace(url, "{{message}}", encoded_message)
    end

    webhooks
      |> Enum.filter(fn hook -> hook.event_type == event end)
      |> Enum.map(fn hook -> hook.url end)
      |> Enum.map(replace_message)
      |> Enum.map(&call_url/1)
  end

  defp call_url(http_url) do
    IO.puts("Calling webhook " <> http_url)

    HTTPoison.start

    case HTTPoison.get(http_url) do
      %HTTPoison.Response{status_code: 200, body: body} ->
        IO.puts "Notify received body " <> body
      %HTTPoison.Response{status_code: 302, body: _body, headers: %{"Location" => location}} ->
        call_url location
      %HTTPoison.Response{status_code: 404} ->
        IO.puts http_url <> " not found :("
      _ ->
        IO.puts " problem calling webhook " <> http_url
    end
  end

end
