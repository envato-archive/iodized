defmodule Yodado.FeatureSetTest do
  defmodule AllTest do
    use ExUnit.Case, async: true
    alias Yodado.FeatureSet, as: FeatureSet

    test "multi_do/1 returns a keyword list of features" do
      result = FeatureSet.multi_do(nil)
      assert Keyword.keyword?(result)
    end
  end
end
