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

  defimpl Rule, for: Atom do
    def matches?(bool, _state) when is_boolean(bool), do: bool
    def json(bool) when is_boolean(bool), do: [operand: "boolean", value: bool]
  end

  defimpl Rule, for: Function do
    def matches?(f, state), do: f.(state)
    def json(_f), do: raise "not implemented"
  end

  def from_json(definition) do
    operand = Keyword.fetch!(definition, :operand)
    from_json(operand, definition)
  end

  defp from_json("any", definition) do
    conditions = Keyword.fetch!(definition, :conditions)
    Any[conditions: Enum.map(conditions, &from_json/1)]
  end

  defp from_json("all", definition) do
    conditions = Keyword.fetch!(definition, :conditions)
    All[conditions: Enum.map(conditions, &from_json/1)]
  end

  defp from_json("included_in", definition) do
    param_name = Keyword.fetch!(definition, :param_name)
    value = Keyword.fetch!(definition, :value)
    true = is_list(value) # validate we've got a list
    IncludedIn[param_name: param_name, value: value]
  end

  defp from_json("is", definition) do
    param_name = Keyword.fetch!(definition, :param_name)
    value = Keyword.fetch!(definition, :value)
    Is[param_name: param_name, value: value]
  end
end
