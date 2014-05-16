defmodule Iodized.Feature do
  defrecord Feature, title: nil, description: nil, master_switch_state: nil, definition: nil
  
  def json(feature) do
    [
      title: feature.title,
      description: feature.description,
      master_switch_state: feature.master_switch_state,
      definition: Iodized.DefinitionJson.Json.to_json(feature.definition)
    ]
  end

  def from_json(json) do
    title = Keyword.fetch!(json, :title)
    description = Keyword.fetch!(json, :description)
    master_switch_state = Keyword.fetch!(json, :master_switch_state)
    definition = Keyword.fetch!(json, :definition) |> Iodized.DefinitionJson.from_json

    Feature[
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
