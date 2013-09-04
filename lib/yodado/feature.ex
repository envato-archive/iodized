defmodule Yodado.Feature do
  
  def do?(feature_id, state) do
    d = definition(feature_id)
    d |> Yodado.Definition.Rule.json |> JSEX.encode!([:indent]) |> IO.puts
    {:ok, Yodado.Definition.Rule.matches?(d, state)}
  end

  def definition(_feature_id) do
    Yodado.Definition.Any[options: [
      Yodado.Definition.All[options: [
        Yodado.Definition.IncludedIn[name: "username", allowed_values: ["madlep", "gstamp"]],
        Yodado.Definition.IncludedIn[name: "host", allowed_values: ["themeforest.net", "codecanyon.net"]]
      ]],
      Yodado.Definition.Is[name: "session_on"],
      Yodado.Definition.IncludedIn[name: "role", allowed_values: ["developer"]]
    ]]
  end
end
