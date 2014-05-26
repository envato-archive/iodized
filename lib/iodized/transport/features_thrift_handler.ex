defmodule Iodized.Transport.FeaturesThriftHandler do
  @persistence Iodized.FeaturePersistence.Mnesia

  def handle_function(:feature_set, {client_state}) do
    # thrift maps are erlang `dict` records,
    # so need to convert to/from that for input/output params
    state = client_state |>
      :dict.to_list() |>
      Enum.into(HashDict.new)

    {:ok, features} = @persistence.all
    feature_set = Iodized.FeatureSet.multi_do(features, state)
    payload = :dict.from_list(feature_set)
    {:reply, payload}
  end

  def handle_function(:ping, {}) do
    {:reply, "pong"}
  end
end
