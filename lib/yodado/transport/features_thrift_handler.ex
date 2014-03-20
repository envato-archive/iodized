defmodule Yodado.Transport.FeaturesThriftHandler do
  def handle_function(:feature_set, {client_state}) do
    # thrift maps are erlang `dict` records,
    # so need to convert to/from that for input/output params
    client_state = :dict.to_list(client_state)
    feature_set = Yodado.FeatureSet.multi_do(client_state)
    payload = :dict.from_list(feature_set)
    {:reply, payload}
  end

  def handle_function(:ping, {}) do
    {:reply, "pong"}
  end
end
