defprotocol Yodado.Definition.Rule do
  def matches?(definition, state)
  def json(definition)
end

defmodule Yodado.Definition do

  alias Yodado.Definition.Rule, as: Rule

  defrecord All, conditions: []
  defimpl Rule, for: All do
    def matches?(All[conditions: conditions], state) do
      conditions |> Enum.all?(&Rule.matches?(&1, state))
    end

    def json(All[conditions: conditions]) do
      [operand: "all", conditions: Enum.map(conditions, &Rule.json/1)]
    end
  end

  defrecord Any, conditions: []
  defimpl Rule, for: Any do
    def matches?(Any[conditions: conditions], state) do
      conditions |> Enum.any?(&Rule.matches?(&1, state))
    end

    def json(Any[conditions: conditions]) do
      [operand: "any", conditions: Enum.map(conditions, &Rule.json/1)]
    end
  end

  defrecord IncludedIn, param_name: nil, value: []
  defimpl Rule, for: IncludedIn do
    def matches?(IncludedIn[param_name: param_name, value: value], state) do
      actual_value = state[param_name]
      Enum.member?(value, actual_value)
    end

    def json(IncludedIn[param_name: param_name, value: value]) do
      [operand: "included_in", param_name: param_name, value: value]
    end
  end

  defrecord Is, param_name: nil, value: "true"
  defimpl Rule, for: Is do
    def matches?(Is[param_name: param_name, value: value], state) do
      state[param_name] == value
    end

    def json(Is[param_name: param_name, value: value]) do
      [operand: "is", param_name: param_name, value: value]
    end
  end

end
