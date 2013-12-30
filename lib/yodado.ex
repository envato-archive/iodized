defmodule Yodado do
  use Application.Behaviour

  def start(_type, _args) do
    start_web()
    # Yodado.MainSup.start_link()
  end

  defp start_web() do
    case Yodado.Web.start() do
      {:ok, _cowboy_pid} -> {:ok, self()}
      any -> any
    end
  end
end
