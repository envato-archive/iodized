defprotocol Definition do
  def matches?(d, state)
  def to_json(d)
  def from_json(definition_json)
end

defmodule Yodado.Model.Feature do

  defrecord Any, options: []
  defrecord All, options: []
  defrecord IncludedIn, name: nil, allowed_values: []
  defrecord Is, name: nil, allowed_value: "true"

  
  def do?(feature_id, state) do
    d = definition(feature_id)
    {:ok, Definition.matches?(d, state)}
  end

  def definition(_feature_id) do
    Any[options: [
      All[options: [
        IncludedIn[name: "username", allowed_values: ["madlep", "gstamp"]],
        IncludedIn[name: "host", allowed_values: ["themeforest.net", "codecanyon.net"]]
      ]],
      Is[name: "session_on"],
      IncludedIn[name: "role", allowed_values: ["developer"]]
    ]]
  end


  defimpl Definition, for: List do
    def from_json(definition_json) do
      Enum.map(definition_json, &Definition.from_json/1)
    end
  end

  defimpl Definition, for: Tuple do
    def from_json(definition_json) do

    end
  end

  defimpl Definition, for: Any do
    def matches?(Any[options: options], state) do
      options |> Enum.any?(&Definition.matches?(&1, state))
    end

    def to_json(Any[options: options]) do
      [any: [options: Enum.map(options, &Definition.to_json/1)]]
    end

    def from_json(_definition_json) do
    end
  end

  defimpl Definition, for: All do
    def matches?(All[options: options], state) do
      options |> Enum.all?(&Definition.matches?(&1, state))
    end

    def to_json(All[options: options]) do
      [all: [options: Enum.map(options, &Definition.to_json/1)]]
    end

    def from_json(_definition_json) do
    end
  end

  defimpl Definition, for: IncludedIn do
    def matches?(IncludedIn[name: name, allowed_values: allowed_values], state) do
      value = state[name]
      Enum.member?(allowed_values, value)
    end

    def to_json(IncludedIn[name: name, allowed_values: allowed_values]) do
      [included_in: [name: name, allowed_values: allowed_values]]
    end

    def from_json(_definition_json) do
    end
  end


  defimpl Definition, for: Is do
    def matches?(Is[name: name, allowed_value: allowed_value], state) do
      state[name] == allowed_value
    end

    def to_json(Is[name: name, allowed_value: allowed_value]) do
      [is: [name: name, allowed_value: allowed_value]]
    end

    def from_json(_definition_json) do
    end
  end
end
