defmodule Yodado.Web do
  use Application.Behaviour

  def start(_type, _args) do
    dispatch = :cowboy_router.compile([
                 {:_, [{"/", Yodado.Web.HelloWorldHandler, []}]}
               ])
    {:ok, _} = :cowboy.start_http(:http, 100,
                                  [port: 8080],
                                  [env: [dispatch: dispatch]])
    {:ok, self}
  end
end
