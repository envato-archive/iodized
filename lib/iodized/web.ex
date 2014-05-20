defmodule Iodized.Web do

  @handler_count 100
  @port 8080

  def start() do
    routes = [
      {"/features", Iodized.Web.FeatureSetHandler, []},
      {"/feature/:feature_id", Iodized.Web.FeatureStatusHandler, []},
      {"/admin/api/features", Iodized.Web.Admin.FeatureListHandler, []},
      {"/admin/api/features/:feature_id", Iodized.Web.Admin.FeatureStatusHandler, []},
      {"/", :cowboy_static, {:priv_file, :iodized, "static/index.html"}},
      {"/[...]", :cowboy_static, {:priv_dir, :iodized, "static"}}
    ]

    dispatch = [ {:_, routes } ] |> :cowboy_router.compile

    :cowboy.start_http( :http, @handler_count, [port: @port], [env: [dispatch: dispatch]])
  end
end
