defprotocol Yodado.Definition.Rule do
  def matches?(definition, state)
  def json(definition)
end

defmodule Yodado.Definition do

  alias Yodado.Definition.Rule, as: Rule

  defrecord All, options: []
  defimpl Rule, for: All do
    def matches?(All[options: options], state) do
      options |> Enum.all?(&Rule.matches?(&1, state))
    end

    def json(All[options: options]) do
      [all: [options: Enum.map(options, &Rule.json/1)]]
    end
  end

  defrecord Any, options: []
  defimpl Rule, for: Any do
    def matches?(Any[options: options], state) do
      options |> Enum.any?(&Rule.matches?(&1, state))
    end

    def json(Any[options: options]) do
      [any: [options: Enum.map(options, &Rule.json/1)]]
    end
  end

  defrecord IncludedIn, name: nil, allowed_values: []
  defimpl Rule, for: IncludedIn do
    def matches?(IncludedIn[name: name, allowed_values: allowed_values], state) do
      value = state[name]
      Enum.member?(allowed_values, value)
    end

    def json(IncludedIn[name: name, allowed_values: allowed_values]) do
      [included_in: [name: name, allowed_values: allowed_values]]
    end
  end

  defrecord Is, name: nil, allowed_value: "true"
  defimpl Rule, for: Is do
    def matches?(Is[name: name, allowed_value: allowed_value], state) do
      state[name] == allowed_value
    end

    def json(Is[name: name, allowed_value: allowed_value]) do
      [is: [name: name, allowed_value: allowed_value]]
    end
  end

end
