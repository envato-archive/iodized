defmodule Iodized.FeatureSet do
  @persistence Iodized.FeaturePersistence.Mnesia

  def multi_do(features, params) do
    lc feature inlist features do
      {:ok, state} = Iodized.Feature.do?(feature, params)
      {feature.title, state}
    end

  end
end
