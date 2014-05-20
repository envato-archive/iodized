defmodule Iodized.FeaturePersistence.Mnesia do

  @table_record Iodized.Feature.Feature

  @all_features_matcher Iodized.Feature.Feature.__record__(:fields) |>
    Enum.map(fn({key, _default}) -> {key, :_} end) |>
    Iodized.Feature.Feature.new

  def all() do
    features = :mnesia.dirty_match_object(@all_features_matcher)
    features = Enum.sort(features, &(&1.title < &2.title))
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
    unless feature.id do
      raise "feature has no id"
    end
    {:atomic, :ok} = :mnesia.transaction(fn() ->
      :mnesia.write(feature)
    end)
    {:ok, true}
  end

  def delete_feature({:key, feature_id}) do
    {:atomic, :ok} = :mnesia.transaction(fn() ->
      :mnesia.delete({@table_record, feature_id})
    end)
    {:ok, true}
  end

  def delete_feature(feature_id) do
    delete_feature({:key, feature_id})
  end

  defp key(feature) when is_record(feature, @table_record) do
    feature.id
  end

  defp key(feature_id) do
    feature_id
  end
end
