defmodule Yodado.Feature do
  
  def do?(feature_id, state) do
    d = definition(feature_id)
    d |> Yodado.Definition.Rule.json |> JSEX.encode!([:indent]) |> IO.puts
    {:ok, Yodado.Definition.Rule.matches?(d, state)}
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
