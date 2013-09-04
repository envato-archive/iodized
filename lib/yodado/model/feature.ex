defmodule Yodado.Model.Feature do

  defrecordp :any, options: []
  defrecordp :all, options: []
  defrecordp :included_in, name: nil, allowed_values: []
  defrecordp :is, name: nil, allowed_value: "true"
  
  def do?(feature_id, state) do
    d = definition(feature_id)
    {:ok, handle_definition(d, state)}
  end

  def definition(_feature_id) do
    any(options: [
      all(options: [
        included_in(name: "username", allowed_values: ["madlep", "gstamp"]),
        included_in(name: "host", allowed_values: ["themeforest.net", "codecanyon.net"])
      ]),
      is(name: "session_on"),
      included_in(name: "role", allowed_values: ["developer"])
    ])
  end

  defp handle_definition(any(options: options), state) do
    options |> Enum.any?(&handle_definition(&1, state))
  end

  defp handle_definition(all(options: options), state) do
    options |> Enum.all?(&handle_definition(&1, state))
  end

  defp handle_definition(included_in(name: name, allowed_values: allowed_values), state) do
    value = state[name]
    Enum.member?(allowed_values, value)
  end

  defp handle_definition(is(name: name, allowed_value: allowed_value), state) do
    state[name] == allowed_value
  end

  def to_json(any(options: options)) do
    [any: [options: Enum.map(options, &to_json/1)]]
  end

  def to_json(all(options: options)) do
    [all: [options: Enum.map(options, &to_json/1)]]
  end

  def to_json(included_in(name: name, allowed_values: allowed_values)) do
    [included_in: [name: name, allowed_values: allowed_values]]
  end

  def to_json(is(name: name, allowed_value: allowed_value)) do
    [is: [name: name, allowed_value: allowed_value]]
  end
end
