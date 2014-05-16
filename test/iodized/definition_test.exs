defmodule Iodized.DefinitionTest do
  use ExUnit.Case, async: true
  alias Iodized.Definition.Rule, as: Rule
  alias Iodized.DefinitionJson.Json, as: Json

  defmodule AllTest do
    use ExUnit.Case, async: true
    alias Iodized.Definition.All, as: All

    test "is true if all conditions match" do
      definition = All[definitions: [true, true]]
      assert Rule.matches?(definition, [])
    end

    test "is false unless all conditions match" do
      definition = All[definitions: [true, false]]
      assert !Rule.matches?(definition, [])
    end

    test "it passes the state through to child conditions" do
      definition = All[definitions: [
        fn(state) -> state[:foo] == 1 end,
        fn(state) -> state[:bar] == 2 end
      ]]
      state = [foo: 1, bar: 2]
      assert Rule.matches?(definition, state)
    end

    test "it generates JSON" do
      definition = All[definitions: [true, false]]
      expected_json = "{\"operand\":\"all\",\"definitions\":[{\"operand\":\"boolean\",\"value\":true},{\"operand\":\"boolean\",\"value\":false}]}"
      actual_json = Json.to_json(definition) |> JSEX.encode!
      assert actual_json == expected_json
    end
  end

  defmodule AnyTest do
    use ExUnit.Case, async: true
    alias Iodized.Definition.Any, as: Any

    test "is true if any conditions match" do
      definition = Any[definitions: [false, true]]
      assert Rule.matches?(definition, [])
    end

    test "is false unless any conditions match" do
      definition = Any[definitions: [false, false]]
      assert !Rule.matches?(definition, [])
    end

    test "it passes the state through to child conditions" do
      definition = Any[definitions: [
        fn(state) -> state[:foo] == 1 end,
        fn(state) -> state[:bar] == 2 end
      ]]
      state = [foo: 1, bar: -666]
      assert Rule.matches?(definition, state)
    end

    test "it generates JSON" do
      definition = Any[definitions: [true, false]]
      expected_json = "{\"operand\":\"any\",\"definitions\":[{\"operand\":\"boolean\",\"value\":true},{\"operand\":\"boolean\",\"value\":false}]}"
      actual_json = Json.to_json(definition) |> JSEX.encode!
      assert actual_json == expected_json
    end
  end

  defmodule IncludedInTest do
    use ExUnit.Case, async: true
    alias Iodized.Definition.IncludedIn, as: IncludedIn

    test "is true if the value of the param in the state is in the list of values" do
      definition = IncludedIn[actual_state_param_name: "username", allowed_values: ["francis", "bill", "zoey", "louis"]]
      state = HashDict.new |> HashDict.put("username", "bill")
      assert Rule.matches?(definition, state)
    end

    test "is false if the value of the param in the state is not in the list of values" do
      definition = IncludedIn[actual_state_param_name: "username", allowed_values: ["francis", "bill", "zoey", "louis"]]
      state = HashDict.new |> HashDict.put("username", "coach")
      assert !Rule.matches?(definition, state)
    end

    test "it generates JSON" do
      definition = IncludedIn[actual_state_param_name: "username", allowed_values: ["francis", "bill", "zoey", "louis"]]
      expected_json = "{\"operand\":\"included_in\",\"param_name\":\"username\",\"value\":[\"francis\",\"bill\",\"zoey\",\"louis\"]}"
      actual_json = Json.to_json(definition) |> JSEX.encode!
      assert actual_json == expected_json
    end
  end


  defmodule IsTest do
    use ExUnit.Case, async: true
    alias Iodized.Definition.Is, as: Is

    test "is true if the value of the param in the state equals the value" do
      definition = Is[actual_state_param_name: "session_on", allowed_value: "yes"]
      state = HashDict.new |> HashDict.put("session_on", "yes")
      assert Rule.matches?(definition, state)
    end

    test "is false if the value of the param in the state does not equals the value" do
      definition = Is[actual_state_param_name: "session_on", allowed_value: "yes"]
      state = HashDict.new |> HashDict.put("session_on", "HAHA")
      assert !Rule.matches?(definition, state)
    end

    test "it generates JSON" do
      definition = Is[actual_state_param_name: "session_on", allowed_value: "yes"]
      expected_json = "{\"operand\":\"is\",\"param_name\":\"session_on\",\"value\":\"yes\"}"
      actual_json = Json.to_json(definition) |> JSEX.encode!
      assert actual_json == expected_json
    end
  end

  defmodule PercentageTest do
    use ExUnit.Case, async: true
    alias Iodized.Definition.Percentage, as: Percentage

    test "matches if the ID's digest modulo 100 is under the given percentage" do
      definition = Percentage[actual_state_param_name: "id", threshold: 50]
      id = "Dance of Death" # digest_int #=> 1
      state = HashDict.new |> HashDict.put("id", id)
      assert(Rule.matches?(definition, state))
    end

    test "doesn't match if the ID's digest modulo 100 is over the given percentage" do
      definition = Percentage[actual_state_param_name: "id", threshold: 50]
      id = "Hello World" # digest_int #=> 57
      state = HashDict.new() |> HashDict.put("id", id)
      refute(Rule.matches?(definition, state))
    end

    test "it serializes" do
      definition = Percentage[actual_state_param_name: "id", threshold: 42]
      expected_json = "{\"operand\":\"percentage\",\"param_name\":\"id\",\"value\":42}"
      actual_json = Json.to_json(definition) |> JSEX.encode!
      assert(actual_json === expected_json)
    end

    test "it deserializes" do
      json = """
        {
          "operand": "percentage",
          "param_name": "something",
          "value": "21"
        }
      """
      actual_definition = json |> JSEX.decode!(labels: :atom) |> Iodized.DefinitionJson.from_json
      expected_definition = Percentage[actual_state_param_name: "something", threshold: 21]
      assert(expected_definition === actual_definition)
    end

  end

  test "parsing from JSON" do
    json = """
      {
       "operand":"any",
       "conditions":[
        {
         "operand":"all",
         "conditions":[
          {
           "operand":"included_in",
           "param_name":"username",
           "value":[
            "madlep",
            "gstamp"
           ]
          },
          {
           "operand":"included_in",
           "param_name":"host",
           "value":[
            "themeforest.net",
            "codecanyon.net"
           ]
          }
         ]
        },
        {
         "operand":"is",
         "param_name":"session_on",
         "value":"true"
        },
        {
         "operand":"included_in",
         "param_name":"role",
         "value":[
          "developer"
         ]
        }
       ]
      }
    """
    actual_definition = json |> JSEX.decode!(labels: :atom) |> Iodized.DefinitionJson.from_json
    expected_definition =
      Iodized.Definition.Any[definitions: [
        Iodized.Definition.All[definitions: [
          Iodized.Definition.IncludedIn[actual_state_param_name: "username", allowed_values: ["madlep", "gstamp"]],
          Iodized.Definition.IncludedIn[actual_state_param_name: "host", allowed_values: ["themeforest.net", "codecanyon.net"]]
        ]],
        Iodized.Definition.Is[actual_state_param_name: "session_on"],
        Iodized.Definition.IncludedIn[actual_state_param_name: "role", allowed_values: ["developer"]]
      ]]

    assert actual_definition == expected_definition
  end
end
