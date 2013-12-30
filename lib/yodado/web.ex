defmodule Yodado.Web do

  @handler_count 100
  @port 8080

  def start() do
    routes = [
      {"/features", Yodado.Web.FeatureSetHandler, []},
      {"/feature/:feature_id", Yodado.Web.FeatureStatusHandler, []},
      {"/admin/api/features", Yodado.Web.Admin.FeatureListHandler, []},
      {"/admin/api/feature/:feature_id", Yodado.Web.Admin.FeatureStatusHandler, []},
      {"/admin", :cowboy_static, [
        directory: {:priv_dir, :yodado, ["static/app"]},
        file: "index.html",
        mimetypes: {&:mimetypes.path_to_mimes/2, :default}
      ]},
      {"/admin/[...]", :cowboy_static, [ 
        directory: {:priv_dir, :yodado, "static/app"},
        mimetypes: {&:mimetypes.path_to_mimes/2, :default}
      ]},
      {"/", :cowboy_static, [ 
        directory: {:priv_dir, :yodado, ["static"]},
        file: "index.html",
        mimetypes: {&:mimetypes.path_to_mimes/2, :default}
      ]},
    ]

    dispatch = [ {:_, routes } ] |> :cowboy_router.compile

    :cowboy.start_http( :http, @handler_count, [port: @port], [env: [dispatch: dispatch]])
  end
end
