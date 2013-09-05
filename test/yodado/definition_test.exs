defmodule Yodado.DefinitionTest do
  use ExUnit.Case, async: true
  alias Yodado.Definition.Rule, as: Rule

  defmodule AllTest do
    use ExUnit.Case, async: true
    alias Yodado.Definition.All, as: All

    test "is true if all conditions match" do
      rule = All[conditions: [true, true]]
      assert Rule.matches?(rule, [])
    end

    test "is false unless all conditions match" do
      rule = All[conditions: [true, false]]
      assert !Rule.matches?(rule, [])
    end

    test "it passes the state through to child conditions" do
      rule = All[conditions: [
        fn(state) -> state[:foo] == 1 end,
        fn(state) -> state[:bar] == 2 end
      ]]
      state = [foo: 1, bar: 2]
      assert Rule.matches?(rule, state)
    end

    test "it generates JSON" do
      rule = All[conditions: [true, false]]
      expected_json = "{\"operand\":\"all\",\"conditions\":[{\"operand\":\"boolean\",\"value\":true},{\"operand\":\"boolean\",\"value\":false}]}"
      actual_json = Rule.json(rule) |> JSEX.encode!
      assert actual_json == expected_json
    end
  end
  
  defmodule AnyTest do
    use ExUnit.Case, async: true
    alias Yodado.Definition.Any, as: Any

    test "is true if any conditions match" do
      rule = Any[conditions: [false, true]]
      assert Rule.matches?(rule, [])
    end

    test "is false unless any conditions match" do
      rule = Any[conditions: [false, false]]
      assert !Rule.matches?(rule, [])
    end

    test "it passes the state through to child conditions" do
      rule = Any[conditions: [
        fn(state) -> state[:foo] == 1 end,
        fn(state) -> state[:bar] == 2 end
      ]]
      state = [foo: 1, bar: -666]
      assert Rule.matches?(rule, state)
    end

    test "it generates JSON" do
      rule = Any[conditions: [true, false]]
      expected_json = "{\"operand\":\"any\",\"conditions\":[{\"operand\":\"boolean\",\"value\":true},{\"operand\":\"boolean\",\"value\":false}]}"
      actual_json = Rule.json(rule) |> JSEX.encode!
      assert actual_json == expected_json
    end
  end

  defmodule IncludedInTest do
    use ExUnit.Case, async: true
    alias Yodado.Definition.IncludedIn, as: IncludedIn

    test "is true if the value of the param in the state is in the list of values" do
      rule = IncludedIn[param_name: "username", value: ["francis", "bill", "zoey", "louis"]]
      assert Rule.matches?(rule, [{"username", "bill"}])
    end

    test "is false if the value of the param in the state is not in the list of values" do
      rule = IncludedIn[param_name: "username", value: ["francis", "bill", "zoey", "louis"]]
      assert !Rule.matches?(rule, [{"username", "coach"}])
    end

    test "it generates JSON" do
      rule = IncludedIn[param_name: "username", value: ["francis", "bill", "zoey", "louis"]]
      expected_json = "{\"operand\":\"included_in\",\"param_name\":\"username\",\"value\":[\"francis\",\"bill\",\"zoey\",\"louis\"]}"
      actual_json = Rule.json(rule) |> JSEX.encode!
      assert actual_json == expected_json
    end
  end
end
