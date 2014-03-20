defmodule Yodado.FeatureSetTest do
  defmodule AllTest do
    use ExUnit.Case, async: true
    import Mock
    alias Yodado.Feature, as: Feature
    alias Yodado.FeatureSet, as: FeatureSet

    test_with_mock "multi_do/1 returns a list of 2-tuples {feature.title, state}", Yodado.FeaturePersistence.Mnesia,
      [all: fn() -> {:ok, [
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
              definition: Yodado.Definition.All[definitions: [
                  Yodado.Definition.Is[actual_state_param_name: "username", allowed_value: "paj"]
                ]
              ]
            ],
          ]
        } end
      ] do

      result = FeatureSet.multi_do([{"username", "paj"}])

      [always, never, sometimes] = result

      assert {"always on feature", true} === always
      assert {"always off feature", false} === never
      assert {"Pete's Feature", true} === sometimes
    end
  end
end
