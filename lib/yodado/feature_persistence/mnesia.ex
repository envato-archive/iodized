defmodule Yodado.FeaturePersistence.Mnesia do

  @table_record Yodado.Feature.Feature

  @all_features_matcher Yodado.Feature.Feature.__record__(:fields) |>
    Enum.map(fn({key, _default}) -> {key, :_} end) |>
    Yodado.Feature.Feature.new

  def new do
    :ok
  end

  def ping(_c) do
    true
  end

  def all(_c) do
    features = :mnesia.dirty_match_object(@all_features_matcher)
    {:ok, features}
  end

  def find_feature({:key, feature_id}, _c) do
    features = :mnesia.dirty_read(@table_record, feature_id)
    case features do
      [feature] ->
        {:ok, feature}
      [] ->
        :not_found
    end
  end

  def find_feature(feature_id, _c) do
    find_feature({:key, key(feature_id)}, _c)
  end

  def save_feature(feature, _c) do
    :ok = :mnesia.transaction(fn() ->
      :mnesia.write(feature)
    end)
    {:ok, true}
  end

  def delete_feature({:key, feature_id}, _c) do
    :ok = :mnesia.transaction(fn() ->
      :mnesia.delete({@table_record, feature_id})
    end)
    {:ok, true}
  end

  def delete_feature(feature_id, _c) do
    delete_feature({:key, feature_id}, _c)
  end

  #TODO this must die
  def sync(features, _c) do
    # TODO not transactional. tut, tut, tut
    {:atomic, :ok} = :mnesia.clear_table(@table_record)
    :mnesia.transaction(fn() ->
      Enum.each(features, fn(f) ->
        {:atomic, :ok} = :mnesia.write(f)
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
