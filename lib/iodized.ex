defmodule Iodized do
  use Application

  def start(_type, _args) do
    start_web()
    start_thrift()
    start_mnesia()
    {:ok, self()}
  end

  defp start_web() do
    if start_services? do
      # TODO this should be supervised
      {:ok, _cowboy_pid} = Iodized.Web.start()
    end
  end

  defp start_thrift() do
    if start_services? do
      # TODO this should be supervised
      {:ok, port} = :application.get_env(:iodized, :thrift_port)
      {:ok, ip}   = :application.get_env(:iodized, :thrift_ip)
      :thrift_socket_server.start(
        handler: Iodized.Transport.FeatureSetThriftHandler,
        service: :features_thrift,
        port: port,
        socket_opts: [recv_timeout: 60000],
        ip: ip)
    end
  end

  # debugging only, kill this shortly
  def test_thrift() do
    {:ok, c} = :thrift_client_util.new('localhost', 12345, :features_thrift, [])
    {c, {:ok, pong}} = :thrift_client.call(c, :ping, [])
    IO.puts "ping=#{pong}"

    args = :dict.from_list([{"ip", "1.2.3.4"}, {"username", "madlep"}])
    {c,{:ok, features_dict}} = :thrift_client.call(c, :feature_set, [args])
    features = :dict.to_list(features_dict)
    IO.puts "feature_set=#{inspect(features)}"

    {_c, :ok} = :thrift_client.close(c)
    :ok
  end

  defp start_mnesia() do
   {:ok, data_dir} = :application.get_env(:iodized, :data_dir)
   :application.set_env(:mnesia, :dir, data_dir)
   :ok = :mnesia.start()
  end

  defp start_services? do
    !(Code.ensure_loaded?(Mix) && Mix.env == :test)
  end

end
