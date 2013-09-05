defmodule Yodado.FeaturePersistence do
  def ping! do
    {:ok, "PONG"} = :eredis.q(:redis, ["PING"])
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
    {:ok, "OK"} = :eredis.q(:redis, ["SET", key(feature), feature_json])
  end

  defp key(feature) when is_record(feature, Yodado.Feature.Feature) do
    key(feature.title)
  end
  defp key(feature_id) do
    id = Regex.replace(%r/[^\w]+/, feature_id, "_") |> String.downcase
    "fid:#{id}"
  end
end
