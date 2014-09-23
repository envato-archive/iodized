defmodule Iodized.Webhook do

  defstruct id: nil, event_type: nil, url: nil

  def json(webhook) do
    %{
      id: webhook.id,
      event_type: webhook.event_type,
      url: webhook.url
    }
  end

  def from_json(json) do

    event_type = Dict.fetch!(json, :event_type)
    url = Dict.fetch!(json, :url)

    %Iodized.Webhook{ event_type: event_type, url: url }
  end

end
