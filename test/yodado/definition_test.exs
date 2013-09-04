defmodule Yodado.DefinitionTest do
  use ExUnit.Case

  defmodule AllTest do
    use ExUnit.Case

    test "is true if all conditions match" do
      rule = Yodado.Definition.All[conditions: [true, true]]
      assert Yodado.Definition.Rule.matches?(rule, [])
    end

    test "is false unless all conditions match" do
      rule = Yodado.Definition.All[conditions: [true, false]]
      assert !Yodado.Definition.Rule.matches?(rule, [])
    end

    test "it passes the state through to child conditions" do
      rule = Yodado.Definition.All[conditions: [
        fn(state) -> state[:foo] == 1 end,
        fn(state) -> state[:bar] == 2 end
      ]]
      state = [foo: 1, bar: 2]
      assert Yodado.Definition.Rule.matches?(rule, state)
    end

    test "it generates JSON" do
      rule = Yodado.Definition.All[conditions: [true, false]]
      expected_json = "{\"operand\":\"all\",\"conditions\":[{\"operand\":\"boolean\",\"value\":true},{\"operand\":\"boolean\",\"value\":false}]}"
      actual_json = Yodado.Definition.Rule.json(rule) |> JSEX.encode!
      assert actual_json == expected_json
    end
  end
end
