defmodule Iodized.Web do

  def start() do
    routes = [
      {"/api/features", Iodized.Transport.FeatureSetRestHandler, []},
      {"/admin/api/webhooks", Iodized.Web.Admin.WebhookListHandler, []},
      {"/admin/api/webhooks/:webhook_id", Iodized.Web.Admin.WebhookStatusHandler, []},
      {"/admin/api/features", Iodized.Web.Admin.FeatureListHandler, []},
      {"/admin/api/features/:feature_id", Iodized.Web.Admin.FeatureStatusHandler, []},
      {"/", :cowboy_static, {:priv_file, :iodized, "ui/public/index.html"}},
      {"/[...]", :cowboy_static, {:priv_dir, :iodized, "ui/public"}}
    ]

    dispatch = [ {:_, routes } ] |> :cowboy_router.compile

    {:ok, port} = :application.get_env(:iodized, :http_port)
    {:ok, handler_count} = :application.get_env(:iodized, :http_handler_count)
    :error_logger.info_msg("starting cowboy HTTP server on port #{port} with #{handler_count} handlers")
    :cowboy.start_http( :http, handler_count, [port: port], [env: [dispatch: dispatch], onresponse: &log/4])
  end

  defp log(status, headers, _body, req) do
    # combined log format from https://httpd.apache.org/docs/trunk/logs.html#accesslog
    #"%h %l %u %t \"%r\" %>s %b \"%{Referer}i\" \"%{User-agent}i\""
    { {ip, _port}, req}       = :cowboy_req.peer(req)
    ip                        = ip |> Tuple.to_list |> Enum.join(".")
    user_identifier           = "-" #meh
    {user_id, req}            = :cowboy_req.header("remote_user", req, "-")
    time                      = Timex.Date.now |> Timex.DateFormat.format!("[{0D}/{Mshort}/{YYYY}:{0h24}:{0m}:{0s} {Z}]")
    {method, req}             = :cowboy_req.method(req)
    {path, req}               = :cowboy_req.path(req)
    {http, req}               = :cowboy_req.version(req)
    request_line              = "\"#{method} #{path} #{http}\""
    {"content-length", size}  = List.keyfind(headers, "content-length", 0)
    {referer, req}            = :cowboy_req.header("referer", req, "-")
    {user_agent, req}         = :cowboy_req.header("user-agent", req, "-")
    IO.puts(Enum.join([ip, user_identifier, user_id, time, request_line, status, size, "\"#{referer}\"", "\"#{user_agent}\""], " "))
    req
  end
end
