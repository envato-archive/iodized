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

  def all() do
    # TODO make this transactional
    {:ok, feature_ids} = :eredis.q(:redis, ["SMEMBERS", index_key()]) 
    features = feature_ids |> Enum.reduce([], fn(id, acc) -> 
      # TODO use MGET here rather than lots of GETs
      case find_feature({:key, id}) do
        :not_found      -> acc
        {:ok, feature}  -> [feature|acc]
      end
    end)
    {:ok, features}
  end

  def find_feature({:key, feature_id}) do
    {:ok, feature_json} = :eredis.q(:redis, ["GET", feature_id])
    case feature_json do
      :undefined  ->  :not_found
      _           ->  feature = JSEX.decode!(feature_json, labels: :atom)
                      {:ok, Yodado.Feature.from_json(feature)}
    end
  end

  def find_feature(feature_id) do
    find_feature({:key, key(feature_id)})
  end


  def save_feature(feature) do
    feature_json = Yodado.Feature.json(feature) |> JSEX.encode!
    feature_key = key(feature)
    [{:ok, "OK"}, {:ok, _lpush_result}]  = :eredis.qp(:redis, [
      ["SET", feature_key, feature_json],
      ["SADD", index_key(), feature_key],
    ])
    {:ok, true}
  end

  def delete_feature({:key, feature_id}) do
    [{:ok, _del_result}, {:ok, _srem_result}] = :eredis.qp(:redis, [
      ["DEL", feature_id],
      ["SREM", index_key(), feature_id]
    ])
    {:ok, true}
  end

  def delete_feature(feature_id) do
    delete_feature({:key, feature_id})
  end

  def sync(features) do
    # TODO make this transactional
    {:ok, feature_ids} = :eredis.q(:redis, ["SMEMBERS", index_key()]) 
    # TODO do M DEL (or whatever)
    feature_ids |> Enum.each(fn(id) ->
      {:ok, true} = delete_feature({:key, id})
    end)

    features |> Enum.each(fn(f) ->
      {:ok, true} = save_feature(f)
    end)
    {:ok, true}
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
