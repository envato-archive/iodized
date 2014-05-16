defmodule Iodized.FeatureTest do
  defmodule AllTest do
    use ExUnit.Case, async: true
    alias Iodized.Feature, as: Feature

    setup do
      {:ok, [
          dummy_state: (HashDict.new |> HashDict.put("WA", "Perth")),

          always_on_feature: Feature.Feature[title: "always on feature",
            description: "Does stuff",
            master_switch_state: true,
            definition: nil
          ],

          always_off_feature: Feature.Feature[title: "always off feature",
            description: "Does nothing",
            master_switch_state: false,
            definition: nil
          ],

          useful_feature: Feature.Feature[title: "Pete's Feature",
            description: "Does stuff",
            master_switch_state: nil,
            definition: Iodized.Definition.All[definitions: [
                Iodized.Definition.Is[actual_state_param_name: "username", allowed_value: "paj"]
              ]
            ]
          ],

          serialized_feature: [
            title: "Pete's Feature",
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

    test "do?/2 returns a tuple {:ok, boolean}", context do
      result = Feature.do?(context[:always_on_feature], nil)
      assert is_tuple(result)
      assert elem(result, 0) === :ok
      assert elem(result, 1) |> is_boolean
    end

    test "serialization", context do
      feature = context[:useful_feature]
      serialized_feature = context[:serialized_feature]

      assert(Feature.json(feature) === serialized_feature)
    end

    test "deserialization", context do
      feature = context[:useful_feature]
      serialized_feature = context[:serialized_feature]

      assert(Feature.from_json(serialized_feature) == feature)
    end

    test "do?/2 is false when no state is sent and master_switch_state is nil", context do
      feature = context[:useful_feature]
      state = context[:dummy_state]
      {:ok, result} = Feature.do?(feature, state)
      refute(result)
    end

    test "do?/2 is true when master_switch_state is true", context do
      feature = context[:always_on_feature]
      state = context[:dummy_state]
      {:ok, result} = Feature.do?(feature, state)
      assert(result)
    end

    test "do?/2 is true when master_switch_state is false", context do
      feature = context[:always_off_feature]
      state = context[:dummy_state]
      {:ok, result} = Feature.do?(feature, state)
      refute(result)
    end

    test "do/?2 is true when the logic says so", context do
      feature = context[:useful_feature]
      state = HashDict.new |> HashDict.put("username", "paj")
      {:ok, result} = Feature.do?(feature, state)
      assert(result)
    end

    test "do/?2 is false when the logic says so", context do
      feature = context[:useful_feature]
      state = HashDict.new |> HashDict.put("username", "madlep")
      {:ok, result} = Feature.do?(feature, state)
      refute(result)
    end

  end
end
