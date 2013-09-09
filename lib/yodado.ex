defmodule Yodado do
  use Application.Behaviour

  def start(_type, _args) do
    start_eredis
  end

  defp start_eredis do
    case :eredis.start_link() do
      {:ok, redis_pid}  -> {:ok, Process.register(redis_pid, :redis)}
                           start_web()
      {:error, error}   -> {:error, "Problem starting eredis error=#{inspect error}"}
    end
  end

  defp start_web() do
    case Yodado.Web.start() do
      {:ok, _cowboy_pid} -> {:ok, self()}
      {:error, error} ->  {:error, error}
    end
  end

end
