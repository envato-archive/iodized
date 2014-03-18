defmodule Yodado do
  use Application.Behaviour

  def start(_type, _args) do
    start_web()
    start_mnesia()
    {:ok, self()}
  end

  defp start_web() do
    {:ok, _cowboy_pid} = Yodado.Web.start()
  end

  defp start_mnesia() do
   {:ok, data_dir} = :application.get_env(:yodado, :data_dir)
   :application.set_env(:mnesia, :dir, data_dir)
   :application.set_env(:mnesia, :core_dir, :tmp)
   :ok = :mnesia.start()
  end

end
