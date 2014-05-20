defmodule Iodized.Feature do
  defrecord Feature, id: nil, title: nil, description: nil, master_switch_state: nil, definition: nil

  def json(feature) do
    %{
      id: feature.id,
      title: feature.title,
      description: feature.description,
      master_switch_state: feature.master_switch_state,
      definition: Iodized.DefinitionJson.Json.to_json(feature.definition)
    }
  end

  def from_json(json) do
    id = json[:id] # maybe unsaved
    title = json.title
    description = json.description
    master_switch_state = json.master_switch_state
    definition = json.definition |> Iodized.DefinitionJson.from_json

    Feature[
      id: id,
      title: title,
      description: description,
      master_switch_state: master_switch_state,
      definition: definition
    ]
  end

  def do?(feature, state) do
    match = case feature.master_switch_state do
      nil -> feature.definition |> Iodized.Definition.Rule.matches? state
      master_switch_state -> master_switch_state
    end
    {:ok, match}
  end
end
