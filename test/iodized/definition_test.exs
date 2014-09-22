defmodule Iodized.DefinitionTest do
  use ExUnit.Case, async: true
  alias Iodized.Definition.Rule, as: Rule

  defmodule AllTest do
    use ExUnit.Case, async: true
    alias Iodized.Definition.All, as: All

    test "is true if all conditions match" do
      definition = %All{definitions: [true, true]}
      assert Rule.matches?(definition, [])
    end

    test "is false unless all conditions match" do
      definition = %All{definitions: [true, false]}
      assert !Rule.matches?(definition, [])
    end

    test "it passes the state through to child conditions" do
      definition = %All{definitions: [
        fn(state) -> state[:foo] == 1 end,
        fn(state) -> state[:bar] == 2 end
      ]}
      state = [foo: 1, bar: 2]
      assert Rule.matches?(definition, state)
    end
  end

  defmodule AnyTest do
    use ExUnit.Case, async: true
    alias Iodized.Definition.Any, as: Any

    test "is true if any conditions match" do
      definition = %Any{definitions: [false, true]}
      assert Rule.matches?(definition, [])
    end

    test "is false unless any conditions match" do
      definition = %Any{definitions: [false, false]}
      assert !Rule.matches?(definition, [])
    end

    test "it passes the state through to child conditions" do
      definition = %Any{definitions: [
        fn(state) -> state[:foo] == 1 end,
        fn(state) -> state[:bar] == 2 end
      ]}
      state = [foo: 1, bar: -666]
      assert Rule.matches?(definition, state)
    end
  end

  defmodule IncludedInTest do
    use ExUnit.Case, async: true
    alias Iodized.Definition.IncludedIn, as: IncludedIn

    test "is true if the value of the param in the state is in the list of values" do
      definition = %IncludedIn{actual_state_param_name: "username", allowed_values: ["francis", "bill", "zoey", "louis"]}
      state = HashDict.new |> HashDict.put("username", "bill")
      assert Rule.matches?(definition, state)
    end

    test "is false if the value of the param in the state is not in the list of values" do
      definition = %IncludedIn{actual_state_param_name: "username", allowed_values: ["francis", "bill", "zoey", "louis"]}
      state = HashDict.new |> HashDict.put("username", "coach")
      assert !Rule.matches?(definition, state)
    end
  end


  defmodule IsTest do
    use ExUnit.Case, async: true
    alias Iodized.Definition.Is, as: Is

    test "is true if the value of the param in the state equals the value" do
      definition = %Is{actual_state_param_name: "session_on", allowed_value: "yes"}
      state = HashDict.new |> HashDict.put("session_on", "yes")
      assert Rule.matches?(definition, state)
    end

    test "is false if the value of the param in the state does not equals the value" do
      definition = %Is{actual_state_param_name: "session_on", allowed_value: "yes"}
      state = HashDict.new |> HashDict.put("session_on", "HAHA")
      assert !Rule.matches?(definition, state)
    end
  end

  defmodule PercentageTest do
    use ExUnit.Case, async: true
    alias Iodized.Definition.Percentage, as: Percentage

    test "matches if the ID's digest modulo 100 is under the given percentage" do
      definition = %Percentage{actual_state_param_name: "id", threshold: 50}
      id = "Dance of Death" # digest_int #=> 1
      state = HashDict.new |> HashDict.put("id", id)
      assert(Rule.matches?(definition, state))
    end

    test "doesn't match if the ID's digest modulo 100 is over the given percentage" do
      definition = %Percentage{actual_state_param_name: "id", threshold: 50}
      id = "Hello World" # digest_int #=> 57
      state = HashDict.new() |> HashDict.put("id", id)
      refute(Rule.matches?(definition, state))
    end
  end

  defmodule NotTest do
    use ExUnit.Case, async: true
    alias Iodized.Definition.Not, as: Not

    test "is true if the nested definition is false" do
      definition = %Not{definition: false}
      assert(Rule.matches?(definition, []))
    end

    test "is false if the nested definition is true" do
      definition = %Not{definition: true}
      refute(Rule.matches?(definition, []))
    end
  end
end
