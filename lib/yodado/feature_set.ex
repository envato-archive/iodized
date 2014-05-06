defmodule Yodado.FeatureSet do
  @persistence Yodado.FeaturePersistence.Mnesia

  def multi_do(features, params) do
    lc feature inlist features do
      {:ok, state} = Yodado.Feature.do?(feature, params)
      {feature.title, state}
    end

  end
end
