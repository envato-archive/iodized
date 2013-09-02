defmodule Yodado.Web do
  use Application.Behaviour

  def start(_type, _args) do
    routes = [
          {"/", :cowboy_static, [ directory: {:priv_dir, :yodado, ["static"]}, file: "index.html" ]},
          {"/hello/", Yodado.Web.HelloWorldHandler, []},
          {"/static/[...]", :cowboy_static, [ directory: {:priv_dir, :yodado, "static"}]}
        ]
    dispatch = [ {:_, routes } ] |> :cowboy_router.compile
    {:ok, _} = :cowboy.start_http(:http, 100,
                                  [port: 8080],
                                  [env: [dispatch: dispatch]])
    {:ok, self}
  end
end
