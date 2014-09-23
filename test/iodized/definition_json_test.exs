defmodule Iodized.DefinitionJsonTest do
  use ExUnit.Case, async: true
  alias Iodized.DefinitionJson.Json, as: Json

  defmodule AllTest do
    use ExUnit.Case, async: true
    alias Iodized.Definition.All, as: All

    test "it generates JSON" do
      definition = %All{definitions: [true, false]}
      expected_json = "{\"definitions\":[{\"operand\":\"boolean\",\"value\":true},{\"operand\":\"boolean\",\"value\":false}],\"operand\":\"all\"}"
      actual_json = Json.to_json(definition) |> JSEX.encode!
      assert actual_json == expected_json
    end
  end


  defmodule NoneTest do
    use ExUnit.Case, async: true
    alias Iodized.Definition.None, as: None

    test "it generates JSON" do
      definition = %None{definitions: [true, false]}
      expected_json = "{\"definitions\":[{\"operand\":\"boolean\",\"value\":true},{\"operand\":\"boolean\",\"value\":false}],\"operand\":\"none\"}"
      actual_json = Json.to_json(definition) |> JSEX.encode!
      assert actual_json == expected_json
    end
  end


  defmodule AnyTest do
    use ExUnit.Case, async: true
    alias Iodized.Definition.Any, as: Any

    test "it generates JSON" do
      definition = %Any{definitions: [true, false]}
      expected_json = "{\"definitions\":[{\"operand\":\"boolean\",\"value\":true},{\"operand\":\"boolean\",\"value\":false}],\"operand\":\"any\"}"
      actual_json = Json.to_json(definition) |> JSEX.encode!
      assert actual_json == expected_json
    end
  end

  defmodule IncludedInTest do
    use ExUnit.Case, async: true
    alias Iodized.Definition.IncludedIn, as: IncludedIn

    test "it generates JSON" do
      definition = %IncludedIn{actual_state_param_name: "username", allowed_values: ["francis", "bill", "zoey", "louis"]}
      expected_json = "{\"operand\":\"included_in\",\"param_name\":\"username\",\"value\":[\"francis\",\"bill\",\"zoey\",\"louis\"]}"
      actual_json = Json.to_json(definition) |> JSEX.encode!
      assert actual_json == expected_json
    end
  end


  defmodule IsTest do
    use ExUnit.Case, async: true
    alias Iodized.Definition.Is, as: Is

    test "it generates JSON" do
      definition = %Is{actual_state_param_name: "session_on", allowed_value: "yes"}
      expected_json = "{\"operand\":\"is\",\"param_name\":\"session_on\",\"value\":\"yes\"}"
      actual_json = Json.to_json(definition) |> JSEX.encode!
      assert actual_json == expected_json
    end
  end

  defmodule PercentageTest do
    use ExUnit.Case, async: true
    alias Iodized.Definition.Percentage, as: Percentage

    test "it serializes" do
      definition = %Percentage{actual_state_param_name: "id", threshold: 42}
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
      expected_definition = %Percentage{actual_state_param_name: "something", threshold: 21}
      assert(expected_definition === actual_definition)
    end

  end

  defmodule NotTest do
    use ExUnit.Case, async: true
    alias Iodized.Definition.Not, as: Not

    test "it serializes" do
      definition = %Not{definition: true}

      expected_json = "{\"definition\":{\"operand\":\"boolean\",\"value\":true},\"operand\":\"not\"}"
      actual_json = Json.to_json(definition) |> JSEX.encode!
      assert actual_json == expected_json
    end

    test "it deserialises" do
      json = """
        {
          "operand": "not",
          "definition": {
            "operand":"is",
            "param_name":"session_on",
            "value":"true"
          }
        }
      """
      actual_definition = json |> JSEX.decode!(labels: :atom) |> Iodized.DefinitionJson.from_json
      expected_definition = %Not{definition: %Iodized.Definition.Is{actual_state_param_name: "session_on", allowed_value: "true"}}
      assert(expected_definition === actual_definition)
    end
  end

  test "parsing from JSON" do
    json = """
      {
       "operand":"any",
       "definitions":[
        {
         "operand":"all",
         "definitions":[
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
         "operand": "not",
         "definition": {
           "operand":"is",
           "param_name":"session_on",
           "value":"true"
          }
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
      %Iodized.Definition.Any{definitions: [
        %Iodized.Definition.All{definitions: [
          %Iodized.Definition.IncludedIn{actual_state_param_name: "username", allowed_values: ["madlep", "gstamp"]},
          %Iodized.Definition.IncludedIn{actual_state_param_name: "host", allowed_values: ["themeforest.net", "codecanyon.net"]}
        ]},
        %Iodized.Definition.Not{definition: %Iodized.Definition.Is{actual_state_param_name: "session_on"}},
        %Iodized.Definition.IncludedIn{actual_state_param_name: "role", allowed_values: ["developer"]}
      ]}

    assert actual_definition == expected_definition
  end
end
