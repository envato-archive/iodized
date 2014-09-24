defmodule Iodized.Feature do
  defstruct id: nil, title: nil, description: nil, master_state: false, dynamic_state: false, definition: nil

  def json(feature) do
    %{
      id: feature.id,
      title: feature.title,
      description: feature.description,
      master_state: feature.master_state,
      dynamic_state: feature.dynamic_state,
      definition: Iodized.DefinitionJson.Json.to_json(feature.definition)
    }
  end

  def from_json(json) do
    id = json[:id] # maybe unsaved
    title = json.title
    description = json.description
    master_state = json.master_state
    dynamic_state = json.dynamic_state
    definition = json.definition |> Iodized.DefinitionJson.from_json

    %Iodized.Feature{
      id: id,
      title: title,
      description: description,
      master_state: master_state,
      dynamic_state: dynamic_state,
      definition: definition
    }
  end

  def do?(feature, state) do
    match = case {feature.master_state, feature.dynamic_state} do
      {true, true} -> feature.definition |> Iodized.Definition.Rule.matches? state
      {true, _}    -> true
      {false, _}   -> false
    end
    {:ok, match}
  end

  def feature_description(feature = %Iodized.Feature{master_state: true}) do
    feature.title <> " in state on"
  end

  def feature_description(feature = %Iodized.Feature{master_state: false}) do
    feature.title <> " in state off"
  end

  def feature_description(feature = %Iodized.Feature{master_state: true, dynamic_state: true}) do
    # TODO: Extend this in the future to provide a description of the dynamic state
    feature.title <> " with a dynamically calculated state"
  end


end
