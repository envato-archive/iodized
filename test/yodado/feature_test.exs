defmodule Yodado.FeatureTest do
  defmodule AllTest do
    use ExUnit.Case, async: true
    alias Yodado.Feature, as: Feature

    setup do
      {:ok, [
          feature: Feature.Feature[title: "Fancy feature",
            description: "Does stuff",
            master_switch_state: nil,
            definition: Yodado.Definition.All[definitions: [
                Yodado.Definition.Is[actual_state_param_name: "username", allowed_value: "paj"]
              ]
            ]
          ],
          serialized_feature: [
            title: "Fancy feature",
            description: "Does stuff",
            master_switch_state: nil,
            definition: [
              operand: "all",
              definitions: [
                [operand: "is", param_name: "username", value: "paj"]
              ]
            ]
          ]
        ]
      }
    end

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

    test "serialization", context do
      feature = context[:feature]
      serialized_feature = context[:serialized_feature]

      assert(Feature.json(feature) === serialized_feature)
    end

    test "deserialization", context do
      feature = context[:feature]
      serialized_feature = context[:serialized_feature]

      assert(Feature.from_json(serialized_feature) == feature)
    end

    test "do?/2 is false when no state is sent", context do
      feature = context[:feature]
      {:ok, state} = Feature.do?(feature, nil)
      refute(state)
    end
  end
end
