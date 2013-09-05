defmodule Yodado.Web do

  @handler_count 100
  @port 8080

  def start() do
    routes = [
      {"/", :cowboy_static, [ 
        directory: {:priv_dir, :yodado, ["static"]},
        file: "index.html",
        mimetypes: {&:mimetypes.path_to_mimes/2, :default}
      ]},
      {"/feature/:feature_id", Yodado.Web.FeatureStatusHandler, []},
      {"/static/[...]", :cowboy_static, [ 
        directory: {:priv_dir, :yodado, "static"},
        mimetypes: {&:mimetypes.path_to_mimes/2, :default}
      ]},
      {"/admin/api/features", Yodado.Web.Admin.FeatureListHandler, []},
      {"/admin/api/feature/:feature_id", Yodado.Web.Admin.FeatureStatusHandler, []}
    ]

    dispatch = [ {:_, routes } ] |> :cowboy_router.compile

    {:ok, _} = :cowboy.start_http( :http, @handler_count, [port: @port], [env: [dispatch: dispatch]])
    :ok
  end
end
