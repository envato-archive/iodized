defmodule Yodado.Transport.FeaturesThriftHandler do
  def handle_function(:feature_set, stuff) do
    features = [{"foo", true}, {"bar", false}]
    payload = :dict.from_list(features)
    {:reply, payload}
  end

  def handle_function(:ping, stuff) do
    {:reply, "pong"}
  end
end
