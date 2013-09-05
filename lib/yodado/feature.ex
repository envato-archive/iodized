defmodule Yodado.Feature do
  defrecord Feature, title: nil, description: nil, master_switch_state: nil, definition: nil
  
  def json(feature) do
    [
      title: feature.title,
      description: feature.description,
      master_switch_state: feature.master_switch_state,
      definition: Yodado.Definition.Rule.json(feature.definition)
    ]
  end

  def from_json(json) do
    title = Keyword.fetch!(json, :title)
    description = Keyword.fetch!(json, :description)
    master_switch_state = Keyword.fetch!(json, :master_switch_state)
    definition = Keyword.fetch!(json, :definition) |> Yodado.Definition.from_json
    Feature[
      title: title,
      description: description,
      master_switch_state: master_switch_state,
      definition: definition
    ]
  end

  def do?(feature_id, state) do
    d = definition(feature_id)
    d |> Yodado.Definition.Rule.json |> JSEX.encode!([:indent]) |> IO.puts
    {:ok, Yodado.Definition.Rule.matches?(d, state)}
  end

  def feature(feature_id) do
    Feature[title: "I am a feature", description: "yodalol quote here", definition: definition(feature_id)]
  end

  def definition(_feature_id) do
    Yodado.Definition.Any[conditions: [
      Yodado.Definition.All[conditions: [
        Yodado.Definition.IncludedIn[param_name: "username", value: ["madlep", "gstamp"]],
        Yodado.Definition.IncludedIn[param_name: "host", value: ["themeforest.net", "codecanyon.net"]]
      ]],
      Yodado.Definition.Is[param_name: "session_on"],
      Yodado.Definition.IncludedIn[param_name: "role", value: ["developer"]]
    ]]
  end
end
