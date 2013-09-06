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
    definition = json[:definition] |> Yodado.Definition.from_json

    Feature[
      title: title,
      description: description,
      master_switch_state: master_switch_state,
      definition: definition
    ]
  end

  def do?(feature, state) do
    match = feature.definition |> Yodado.Definition.Rule.matches? state
    {:ok, match}
  end
end
