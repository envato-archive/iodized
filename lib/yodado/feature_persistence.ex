defmodule Yodado.FeaturePersistence do
  @key_prefix "feature"
  @id_prefix "id"
  @index_key "index"

  def ping do
    case :eredis.q(:redis, ["PING"]) do
      {:ok, "PONG"} ->  true
      _any          ->  false
    end
  end

  def find_feature(feature_id) do
    {:ok, feature_json} = :eredis.q(:redis, ["GET", key(feature_id)])
    case feature_json do
      :undefined  ->  :not_found
      _           ->  feature = JSEX.decode!(feature_json, labels: :atom)
                      {:ok, Yodado.Feature.from_json(feature)}
    end
  end

  def save_feature(feature) do
    feature_json = Yodado.Feature.json(feature) |> JSEX.encode!
    feature_key = key(feature)
    [{:ok, "OK"}, {:ok, _lpush_result}]  = :eredis.qp(:redis, [
      ["SET", feature_key, feature_json],
      ["SADD", index_key(), feature_key],
    ])
  end

  defp key(feature) when is_record(feature, Yodado.Feature.Feature) do
    key(feature.title)
  end

  defp key(feature_id) do
    id = Regex.replace(%r/[^\w]+/, feature_id, "_") |> String.downcase
    "#{@key_prefix}:#{@id_prefix}:#{id}"
  end

  defp index_key() do
    "#{@key_prefix}:#{@index_key}"
  end
end
