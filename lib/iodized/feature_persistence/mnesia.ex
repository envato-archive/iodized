defmodule Iodized.FeaturePersistence.Mnesia do

  @table :feature

  def all() do
    id_wildcard = feature_wildcard = :_
    match = {@table, id_wildcard, feature_wildcard}
    features = :mnesia.dirty_match_object(match) |>
      Enum.map(fn({@table, _id, feature}) -> feature end) |>
      Enum.sort(&(&1.title < &2.title))
    {:ok, features}
  end

  def find_feature({:key, feature_id}) do
    features = :mnesia.dirty_read(@table, feature_id)
    case features do
      [{@table, _id, feature}] ->
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
      :mnesia.write({@table, feature.id, feature})
    end)
    {:ok, true}
  end

  def delete_feature({:key, feature_id}) do
    {:atomic, :ok} = :mnesia.transaction(fn() ->
      :mnesia.delete({@table, feature_id})
    end)
    {:ok, true}
  end

  def delete_feature(feature_id) do
    delete_feature({:key, feature_id})
  end

  defp key(feature) when is_map(feature) do
    feature.id
  end

  defp key(feature_id) do
    feature_id
  end
end
