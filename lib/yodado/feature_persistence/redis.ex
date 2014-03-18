defmodule Yodado.FeaturePersistence.Redis do
  alias Yodado.Feature, as: Feature

  @key_prefix "feature"
  @id_prefix "id"
  @index_key "index"

  def new do
    {:ok, c} = :eredis.start_link()
    c
  end

  def ping(c) do
    case :eredis.q(c, ["PING"]) do
      {:ok, "PONG"} ->  true
      _any          ->  false
    end
  end

  def all(c) do
    # TODO use transaction/MGET here rather than lots of GETs to make this atomic
    {:ok, feature_ids} = :eredis.q(c, ["SMEMBERS", index_key()])

    features = Enum.reduce(feature_ids, [], fn(id, acc) ->
      case find_feature({:key, id}, c) do
        :not_found      -> acc
        {:ok, feature}  -> [feature|acc]
      end
    end)

    {:ok, features}
  end

  def find_feature({:key, feature_id}, c) do
    {:ok, feature_json} = :eredis.q(c, ["GET", feature_id])

    case feature_json do
      :undefined  ->
        :not_found
      _json_str   ->
        feature = JSEX.decode!(feature_json, labels: :atom)
        {:ok, Feature.from_json(feature)}
    end
  end

  def find_feature(feature_id, c) do
    find_feature({:key, key(feature_id)}, c)
  end

  def save_feature(feature, c) do
    feature_json = Feature.json(feature) |> JSEX.encode!

    feature_key = key(feature)

    [{:ok, "OK"}, {:ok, _lpush_result}]  = :eredis.qp(c, [
      ["SET", feature_key, feature_json],
      ["SADD", index_key(), feature_key],
      ])
    {:ok, true}
  end

  def delete_feature({:key, feature_id}, c) do
    [{:ok, _del_result}, {:ok, _srem_result}] = :eredis.qp(c, [
      ["DEL", feature_id],
      ["SREM", index_key(), feature_id]
      ])
    {:ok, true}
  end

  def delete_feature(feature_id, c) do
    delete_feature({:key, feature_id}, c)
  end

  def sync(features, c) do
    # TODO make this transactional
    {:ok, feature_ids} = :eredis.q(c, ["SMEMBERS", index_key()])
    # TODO do M DEL (or whatever)
    feature_ids |> Enum.each(fn(id) ->
      {:ok, true} = delete_feature({:key, id}, c)
    end)

    features |> Enum.each(fn(f) ->
      {:ok, true} = save_feature(f, c)
    end)
    {:ok, true}
  end

  defp key(feature) when is_record(feature, Feature.Feature) do
    key(feature.title)
  end

  defp key(feature_id) do
    id = Regex.replace(~r/[^\w]+/, feature_id, "_") |> String.downcase
    "#{@key_prefix}:#{@id_prefix}:#{id}"
  end

  defp index_key() do
    "#{@key_prefix}:#{@index_key}"
  end
end
