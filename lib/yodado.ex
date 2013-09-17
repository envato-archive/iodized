defmodule Yodado do
  use Application.Behaviour

  def start(_type, _args) do
    case :poolboy.start_link([worker_module: :eredis, size: 50, max_overflow: 0], []) do
      {:ok, redis_pool_pid}  -> {:ok, Process.register(redis_pool_pid, :redis_pool_pid)}
                                start_web()
      {:error, error}   ->      {:error, "Problem starting eredis error=#{inspect error}"}
    end
  end

  defp start_web() do
    case Yodado.Web.start() do
      {:ok, _cowboy_pid} -> {:ok, self()}
      {:error, error} ->  {:error, "Problem staring cowboy error=#{error}"}
    end
  end

end
