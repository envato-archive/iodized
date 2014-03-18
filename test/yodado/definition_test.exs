defmodule Yodado.DefinitionTest do
  use ExUnit.Case, async: true
  alias Yodado.Definition.Rule, as: Rule
  alias Yodado.DefinitionJson.Json, as: Json

  defmodule AllTest do
    use ExUnit.Case, async: true
    alias Yodado.Definition.All, as: All

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
      expected_json = "{\"operand\":\"all\",\"conditions\":[{\"operand\":\"boolean\",\"value\":true},{\"operand\":\"boolean\",\"value\":false}]}"
      actual_json = Json.to_json(definition) |> JSEX.encode!
      assert actual_json == expected_json
    end
  end
  
  defmodule AnyTest do
    use ExUnit.Case, async: true
    alias Yodado.Definition.Any, as: Any

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
      expected_json = "{\"operand\":\"any\",\"conditions\":[{\"operand\":\"boolean\",\"value\":true},{\"operand\":\"boolean\",\"value\":false}]}"
      actual_json = Json.to_json(definition) |> JSEX.encode!
      assert actual_json == expected_json
    end
  end

  defmodule IncludedInTest do
    use ExUnit.Case, async: true
    alias Yodado.Definition.IncludedIn, as: IncludedIn

    test "is true if the value of the param in the state is in the list of values" do
      definition = IncludedIn[actual_state_param_name: "username", allowed_values: ["francis", "bill", "zoey", "louis"]]
      assert Rule.matches?(definition, [{"username", "bill"}])
    end

    test "is false if the value of the param in the state is not in the list of values" do
      definition = IncludedIn[actual_state_param_name: "username", allowed_values: ["francis", "bill", "zoey", "louis"]]
      assert !Rule.matches?(definition, [{"username", "coach"}])
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
    alias Yodado.Definition.Is, as: Is

    test "is true if the value of the param in the state equals the value" do
      definition = Is[actual_state_param_name: "session_on", allowed_value: "yes"]
      assert Rule.matches?(definition, [{"session_on", "yes"}]) 
    end

    test "is false if the value of the param in the state does not equals the value" do
      definition = Is[actual_state_param_name: "session_on", allowed_value: "yes"]
      assert !Rule.matches?(definition, [{"session_on", "HAHA"}]) 
    end

    test "it generates JSON" do
      definition = Is[actual_state_param_name: "session_on", allowed_value: "yes"]
      expected_json = "{\"operand\":\"is\",\"param_name\":\"session_on\",\"value\":\"yes\"}"
      actual_json = Json.to_json(definition) |> JSEX.encode!
      assert actual_json == expected_json
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
    actual_definition = json |> JSEX.decode!(labels: :atom) |> Yodado.Definition.from_json
    expected_definition = 
      Yodado.Definition.Any[definitions: [
        Yodado.Definition.All[definitions: [
          Yodado.Definition.IncludedIn[actual_state_param_name: "username", allowed_values: ["madlep", "gstamp"]],
          Yodado.Definition.IncludedIn[actual_state_param_name: "host", allowed_values: ["themeforest.net", "codecanyon.net"]]
        ]],
        Yodado.Definition.Is[actual_state_param_name: "session_on"],
        Yodado.Definition.IncludedIn[actual_state_param_name: "role", allowed_values: ["developer"]]
      ]]

    assert actual_definition == expected_definition
  end
end
