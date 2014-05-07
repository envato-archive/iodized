defmodule Yodado.FeaturePersistence.Mnesia do

  @table_record Yodado.Feature.Feature

  @all_features_matcher Yodado.Feature.Feature.__record__(:fields) |>
    Enum.map(fn({key, _default}) -> {key, :_} end) |>
    Yodado.Feature.Feature.new

  def all() do
    features = :mnesia.dirty_match_object(@all_features_matcher)
    {:ok, features}
  end

  def find_feature({:key, feature_id}) do
    features = :mnesia.dirty_read(@table_record, feature_id)
    case features do
      [feature] ->
        {:ok, feature}
      [] ->
        :not_found
    end
  end

  def find_feature(feature_id) do
    find_feature({:key, key(feature_id)})
  end

  def save_feature(feature) do
    {:atomic, :ok} = :mnesia.transaction(fn() ->
      :mnesia.write(feature)
    end)
    {:ok, true}
  end

  def delete_feature({:key, feature_id}) do
    :ok = :mnesia.transaction(fn() ->
      :mnesia.delete({@table_record, feature_id})
    end)
    {:ok, true}
  end

  def delete_feature(feature_id) do
    delete_feature({:key, feature_id})
  end

  #TODO this must die. only used by old JS client
  def sync(features) do
    {:atomic, :ok} =  :mnesia.transaction(fn() ->
      #TODO slow, and hacky...
      keys = :mnesia.all_keys(@table_record)
      Enum.each(keys, fn(k) ->
        :ok = :mnesia.delete({@table_record, k})
      end)

      Enum.each(features, fn(f) ->
        :ok = :mnesia.write(f)
      end)
    end)
    {:ok, true}
  end

  defp key(feature) when is_record(feature, @table_record) do
    feature.title
  end

  defp key(feature_id) do
    feature_id
  end
end
