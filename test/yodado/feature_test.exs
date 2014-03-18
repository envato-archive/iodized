defmodule Yodado.FeatureTest do
  defmodule AllTest do
    use ExUnit.Case, async: true
    alias Yodado.Feature, as: Feature

    test "do?/2 returns a tuple {:ok, boolean} " do
      fancy_feature = Feature.Feature[title: "Fancy feature", 
        description: "Does stuff",
        master_switch_state: true,
        definition: nil
      ]
      result = Feature.do?(fancy_feature, nil)
      assert is_tuple(result)
      assert elem(result, 0) === :ok
      assert elem(result, 1) |> is_boolean
    end
  end
end
