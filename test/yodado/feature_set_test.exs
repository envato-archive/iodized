defmodule Yodado.FeatureSetTest do
  defmodule AllTest do
    use ExUnit.Case, async: true
    alias Yodado.FeatureSet, as: FeatureSet

    test "multi_do/1 returns a list of 2-tuples {feature.title, state}" do
      # TODO Inject fake data
      result = FeatureSet.multi_do([])
      assert is_list(result)

      [first | _ ] = result
      {title, state} = first

      assert is_binary(title)
      assert is_boolean(state)
    end
  end
end
