defmodule Iodized.Web do

  def start() do
    routes = [
      {"/api/features", Iodized.Transport.FeatureSetRestHandler, []},
      {"/admin/api/features", Iodized.Web.Admin.FeatureListHandler, []},
      {"/admin/api/features/:feature_id", Iodized.Web.Admin.FeatureStatusHandler, []},
      {"/", :cowboy_static, {:priv_file, :iodized, "static/index.html"}},
      {"/[...]", :cowboy_static, {:priv_dir, :iodized, "static"}}
    ]

    dispatch = [ {:_, routes } ] |> :cowboy_router.compile

    {:ok, port} = :application.get_env(:iodized, :http_port)
    {:ok, handler_count} = :application.get_env(:iodized, :http_handler_count)
    :error_logger.info_msg("starting cowboy HTTP server on port #{port} with #{handler_count} handlers")
    :cowboy.start_http( :http, handler_count, [port: port], [env: [dispatch: dispatch]])
  end
end
