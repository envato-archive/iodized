defmodule Iodized.NotificationTest do
  use ExUnit.Case, async: true
  import Mock

  test_with_mock "call registered urls with message",
    HTTPoison,
    [start: &mock_start/0,
     get: &mock_get/1] do
    webhooks = [
      %Iodized.Webhook{id: 1, event_type: "created", url: "http://someurl.com/msg={{message}}"}
    ]

    Iodized.Notification.notify_event("created", "ice cream is the best", webhooks)

    assert called HTTPoison.start()
    assert called HTTPoison.get("http://someurl.com/msg=ice%20cream%20is%20the%20best")

  end

  defp mock_start() do
    nil
  end

  def mock_get(url) do
    %HTTPoison.Response{status_code: 200, body: ""}
  end

end
