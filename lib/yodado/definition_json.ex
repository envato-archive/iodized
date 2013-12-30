defmodule Yodado.DefinitionJson do
  def from_json(nil) do
    nil
  end

  def from_json(definition) do
    operand = Keyword.fetch!(definition, :operand)
    from_json(operand, definition)
  end

  defp from_json("Any", definition), do: composite_from_json(Yodado.Definition.Any, definition)

  defp from_json("All", definition), do: composite_from_json(Yodado.Definition.All, definition)

  defp from_json("IncludedIn", definition) do
    actual_state_param_name = Keyword.fetch!(definition, :actual_state_param_name)
    allowed_values = Keyword.fetch!(definition, :allowed_values)
    true = is_list(allowed_values) # validate we've got a list
    Yodado.Definition.IncludedIn[actual_state_param_name: actual_state_param_name, allowed_values: allowed_values]
  end

  defp from_json("Is", definition) do
    actual_state_param_name = Keyword.fetch!(definition, :actual_state_param_name)
    allowed_value = Keyword.fetch!(definition, :allowed_value)
    Yodado.Definition.Is[actual_state_param_name: actual_state_param_name, allowed_value: allowed_value]
  end

  defp composite_from_json(record_type, definition) do
    definitions = Keyword.fetch!(definition, :definitions)
    record_type[defintions: Enum.map(definitions, &from_json/1)]
  end
end
