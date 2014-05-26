defmodule Iodized.FeatureSetTest do
  defmodule AllTest do
    use ExUnit.Case, async: true
    alias Iodized.FeatureSet, as: FeatureSet

    test "multi_do/1 returns a list of 2-tuples {feature.title, state}" do
      features = [
        %Iodized.Feature{title: "always on feature",
          description: "Does stuff",
          master_switch_state: "on",
          definition: nil
        },

        %Iodized.Feature{title: "always off feature",
          description: "Does nothing",
          master_switch_state: "off",
          definition: nil
        },

        %Iodized.Feature{title: "Pete's Feature",
          description: "Does stuff",
          master_switch_state: "dynamic",
          definition: Iodized.Definition.All[definitions: [
              Iodized.Definition.Is[actual_state_param_name: "username", allowed_value: "paj"]
            ]
          ]
        },
      ]
      state = HashDict.new |> HashDict.put("username", "paj")
      result = FeatureSet.multi_do(features, state)

      [always, never, sometimes] = result

      assert {"always on feature", true} === always
      assert {"always off feature", false} === never
      assert {"Pete's Feature", true} === sometimes
    end
  end
end
