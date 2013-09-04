defmodule Yodado.Model.Feature do

  defrecord Any, options: []
  defrecord All, options: []
  defrecord IncludedIn, name: nil, allowed_values: []
  defrecord Is, name: nil, allowed_value: "true"
  
  def do?(feature_id, state) do
    d = definition(feature_id)
    {:ok, handle_definition(d, state)}
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

  defp handle_definition(Any[options: options], state) do
    options |> Enum.any?(&handle_definition(&1, state))
  end

  defp handle_definition(All[options: options], state) do
    options |> Enum.all?(&handle_definition(&1, state))
  end

  defp handle_definition(IncludedIn[name: name, allowed_values: allowed_values], state) do
    value = state[name]
    Enum.member?(allowed_values, value)
  end

  defp handle_definition(Is[name: name, allowed_value: allowed_value], state) do
    state[name] == allowed_value
  end

  def to_json(Any[options: options]) do
    [any: [options: Enum.map(options, &to_json/1)]]
  end

  def to_json(All[options: options]) do
    [all: [options: Enum.map(options, &to_json/1)]]
  end

  def to_json(IncludedIn[name: name, allowed_values: allowed_values]) do
    [included_in: [name: name, allowed_values: allowed_values]]
  end

  def to_json(Is[name: name, allowed_value: allowed_value]) do
    [is: [name: name, allowed_value: allowed_value]]
  end
end
