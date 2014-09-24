defmodule Iodized.Feature do
  defstruct id: nil, title: nil, description: nil, master_switch_state: nil, definition: nil

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

    %Iodized.Feature{
      id: id,
      title: title,
      description: description,
      master_switch_state: master_switch_state,
      definition: definition
    }
  end

  def do?(feature, state) do
    match = case feature.master_switch_state do
      "dynamic" -> feature.definition |> Iodized.Definition.Rule.matches? state
      "on"      -> true
      "off"     -> false
    end
    {:ok, match}
  end

  def feature_description(feature = %Iodized.Feature{master_switch_state: "on"}) do
    feature.title <> " in state on"
  end

  def feature_description(feature = %Iodized.Feature{master_switch_state: "off"}) do
    feature.title <> " in state off"
  end

  def feature_description(feature = %Iodized.Feature{master_switch_state: "dynamic"}) do
    # TODO: Extend this in the future to provide a description of the dynamic state
    feature.title <> " with a dynamically calculated state"
  end

end
