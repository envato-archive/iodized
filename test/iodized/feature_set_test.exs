defmodule Iodized.FeatureSetTest do
  defmodule AllTest do
    use ExUnit.Case, async: true
    alias Iodized.Feature, as: Feature
    alias Iodized.FeatureSet, as: FeatureSet

    test "multi_do/1 returns a list of 2-tuples {feature.title, state}" do
      features = [
        Feature.Feature[title: "always on feature",
          description: "Does stuff",
          master_switch_state: true,
          definition: nil
        ],

        Feature.Feature[title: "always off feature",
          description: "Does nothing",
          master_switch_state: false,
          definition: nil
        ],

        Feature.Feature[title: "Pete's Feature",
          description: "Does stuff",
          master_switch_state: nil,
          definition: Iodized.Definition.All[definitions: [
              Iodized.Definition.Is[actual_state_param_name: "username", allowed_value: "paj"]
            ]
          ]
        ],
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