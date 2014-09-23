defmodule Iodized.SendNotification do
  def call_url(http_url) do
    HTTPoison.start

    case HTTPoison.get(http_url) do
      %HTTPoison.Response{status_code: 200, body: body} ->
        IO.puts body
      %HTTPoison.Response{status_code: 302, body: _body, headers: %{"Location" => location}} ->
        call_url location
      %HTTPoison.Response{status_code: 404} ->
        IO.puts http_url <> " not found :("
    end
  end
end
