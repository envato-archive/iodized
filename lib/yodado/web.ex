defmodule Yodado.Web do

  @handler_count 100
  @port 8080

  def start() do
    routes = [
      {"/features", Yodado.Web.FeatureSetHandler, []},
      {"/feature/:feature_id", Yodado.Web.FeatureStatusHandler, []},
      {"/admin/api/features", Yodado.Web.Admin.FeatureListHandler, []},
      {"/admin/api/feature/:feature_id", Yodado.Web.Admin.FeatureStatusHandler, []},
      {"/", :cowboy_static, {:priv_file, :yodado, "static/index.html"}},
      {"/[...]", :cowboy_static, {:priv_dir, :yodado, "static"}},
      {"/try", Yodado.Web.TryHandler, []}
    ]

    dispatch = [ {:_, routes } ] |> :cowboy_router.compile

    :cowboy.start_http( :http, @handler_count, [port: @port], [env: [dispatch: dispatch]])
  end
end
