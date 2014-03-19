defmodule Yodado.FeatureSet do
  @persistence Yodado.FeaturePersistence.Mnesia

  def multi_do(params) do
    {:ok, features} = @persistence.all()
    lc feature inlist features do
      {binary_to_atom(feature.title), true}
    end
  end
end
