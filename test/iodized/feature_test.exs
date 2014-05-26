defmodule Iodized.FeatureTest do
  defmodule AllTest do
    use ExUnit.Case, async: true

    setup do
      {:ok, [
          dummy_state: (HashDict.new |> HashDict.put("WA", "Perth")),

          always_on_feature: %Iodized.Feature{
            id: 1,
            title: "always on feature",
            description: "Does stuff",
            master_switch_state: "on",
            definition: nil
          },

          always_off_feature: %Iodized.Feature{
            id: 2,
            title: "always off feature",
            description: "Does nothing",
            master_switch_state: "off",
            definition: nil
          },

          useful_feature: %Iodized.Feature{
            id: 3,
            title: "Pete's Feature",
            description: "Does stuff",
            master_switch_state: "dynamic",
            definition: Iodized.Definition.All[definitions: [
                Iodized.Definition.Is[actual_state_param_name: "username", allowed_value: "paj"]
              ]
            ]
          },

          serialized_feature: %{
            id: 3,
            title: "Pete's Feature",
            description: "Does stuff",
            master_switch_state: "dynamic",
            definition: %{
              operand: "all",
              definitions: [
                %{
                  operand: "is", param_name: "username", value: "paj"
                }
              ]
            }
          }
        ]
      }
    end

    test "do?/2 returns a tuple {:ok, boolean}", context do
      result = Iodized.Feature.do?(context[:always_on_feature], nil)
      assert is_tuple(result)
      assert elem(result, 0) === :ok
      assert elem(result, 1) |> is_boolean
    end

    test "serialization", context do
      feature = context[:useful_feature]
      serialized_feature = context[:serialized_feature]

      assert(Iodized.Feature.json(feature) === serialized_feature)
    end

    test "deserialization", context do
      feature = context[:useful_feature]
      serialized_feature = context[:serialized_feature]

      assert(Iodized.Feature.from_json(serialized_feature) == feature)
    end

    test "do?/2 is false when no state is sent and master_switch_state is nil", context do
      feature = context[:useful_feature]
      state = context[:dummy_state]
      {:ok, result} = Iodized.Feature.do?(feature, state)
      refute(result)
    end

    test "do?/2 is true when master_switch_state is true", context do
      feature = context[:always_on_feature]
      state = context[:dummy_state]
      {:ok, result} = Iodized.Feature.do?(feature, state)
      assert(result)
    end

    test "do?/2 is true when master_switch_state is false", context do
      feature = context[:always_off_feature]
      state = context[:dummy_state]
      {:ok, result} = Iodized.Feature.do?(feature, state)
      refute(result)
    end

    test "do/?2 is true when the logic says so", context do
      feature = context[:useful_feature]
      state = HashDict.new |> HashDict.put("username", "paj")
      {:ok, result} = Iodized.Feature.do?(feature, state)
      assert(result)
    end

    test "do/?2 is false when the logic says so", context do
      feature = context[:useful_feature]
      state = HashDict.new |> HashDict.put("username", "madlep")
      {:ok, result} = Iodized.Feature.do?(feature, state)
      refute(result)
    end

  end
end
