defmodule Yodado do
  use Application.Behaviour

  def start(_type, _args) do
    {:ok, redis_pid} = :eredis.start_link()
    Process.register(redis_pid, :redis) # TODO figure out nicer/more scalable of handling this
    :ok  = Yodado.Web.start
    {:ok, self}
  end
end
