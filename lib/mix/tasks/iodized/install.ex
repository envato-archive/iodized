defmodule Mix.Tasks.Iodized.Install do
  use Mix.Task

  @shortdoc "set up iodized"

  def run(argv) do
    args = parse_args!(argv)
    install(cluster_mode, args[:nodes])
  end

  defp parse_args!(argv) do
    parse_opts = [strict: [node: :keep, help: :boolean]]
    {parsed, _argv, errors} = OptionParser.parse(argv, parse_opts)

    if parsed[:help] do
      Mix.shell.info( """
usage: mix iodized.install [--node name1@server1 --node name2@server2] [--help]

  node  erlang nodes(s) mnesia schema/tables are to be installed on.
  help  this message
""")
      System.halt
    end

    if length(errors) > 0 do
      errors_str = Dict.keys(errors) |> Enum.join(", ")
      Mix.shell.error("bad arguments: #{errors_str}")
      System.halt(1)
    end

    nodes = Keyword.get_values(parsed, :node) |> Enum.map(&(String.to_atom(&1)))

    if cluster_mode == :local && length(nodes) > 0 do
      Mix.shell.error("--node argument specified, but no --name or --sname specified. Either run without --node arguments (for local install), or provide a --name or --sname argument (for clustered install).")
      System.halt(1)
    end

    if cluster_mode == :clustered && length(nodes) == 0 do
      Mix.shell.error("--node argument NOT specified, and --name or --sname specified. Either run without --node arguments (for local install), or provide a --name or --sname argument (for clustered install).")
      System.halt(1)
    end

    [nodes: nodes]
  end

  defp cluster_mode do
    case Node.alive? do
      false -> :local
      true  -> :clustered
    end
  end

  defp install(:local, []) do
    configure_mnesia_dir
    ensure!(:local, :feature_table_created, [node])
    ensure!(:local, :webhook_table_created, [node])
  end

  defp install(:clustered, nodes) do
    ensure_nodes_online!(nodes)
    ensure!(:clustered, :feature_table_created, nodes)
    ensure!(:clustered, :webhook_table_created, nodes)
  end

  defp configure_mnesia_dir do
    if :application.get_env(:mnesia, :dir) == :undefined do
      data_dir = (:os.getenv("DATA_DIR") || 'data') |>
      IO.iodata_to_binary |>
      String.to_atom
      :application.set_env(:mnesia, :dir, data_dir)
    end
  end

  defp ensure!(cluster_mode, work_to_do, work_nodes) do
    if work?(cluster_mode, work_to_do, work_nodes) do
      Mix.shell.info("ensuring #{work_to_do} on #{inspect work_nodes}")
      case work!(cluster_mode, work_to_do, work_nodes) do
        :ok -> :ok
        {:error, reason}  ->
          Mix.shell.error("error ensuring #{work_to_do} on #{inspect work_nodes}: #{inspect reason}")
          System.halt(1)
      end
      # double check we're done
      if work?(cluster_mode, work_to_do, work_nodes) do
        Mix.shell.error("should be no more work to do for #{work_to_do} on #{inspect work_nodes}, but there was")
        System.halt(1)
      end
    end
  end

  defp work?(:local, :schema_created, work_nodes) do
    :application.ensure_started(:mnesia)
    Enum.sort(:mnesia.table_info(:schema, :disc_copies)) != Enum.sort(work_nodes)
  end

  defp work?(:local, :feature_table_created, work_nodes) do
    ensure!(:local, :schema_created, work_nodes)
    :application.ensure_started(:mnesia)
    not (:mnesia.system_info(:tables) |> Enum.member?(:feature))
  end

  defp work?(:local, :webhook_table_created, work_nodes) do
    ensure!(:local, :schema_created, work_nodes)
    :application.ensure_started(:mnesia)
    not (:mnesia.system_info(:tables) |> Enum.member?(:webhook))
  end

  defp work?(:clustered, :schema_created, work_nodes) do
    ensure_mnesia_started(work_nodes)

    [primary_node | _nodes] = work_nodes # not actually primary, just the first one
    current_nodes = :rpc.call(primary_node, :mnesia, :table_info, [:schema, :disc_copies])
    Enum.sort(current_nodes) != Enum.sort(work_nodes)
  end

  defp work?(:clustered, :feature_table_created, work_nodes) do
    ensure!(:clustered, :schema_created, work_nodes)

    ensure_mnesia_started(work_nodes)

    [primary_node | _nodes] = work_nodes # not actually primary, just the first one
    table_info = :rpc.call(primary_node, :mnesia, :system_info, [:tables])
    not (table_info |> Enum.member?(:feature))
  end

  defp work?(:clustered, :webhook_table_created, work_nodes) do
    ensure!(:clustered, :schema_created, work_nodes)

    ensure_mnesia_started(work_nodes)

    [primary_node | _nodes] = work_nodes # not actually primary, just the first one
    table_info = :rpc.call(primary_node, :mnesia, :system_info, [:tables])
    not (table_info |> Enum.member?(:webhook))
  end

  defp work!(:local, :schema_created, work_nodes) do
    :application.stop :mnesia
    :mnesia.create_schema(work_nodes)
  end

  defp work!(:local, :feature_table_created, work_nodes) do
    :application.ensure_started(:mnesia)
    tab_def = [ attributes: [:id, :feature], disc_copies: work_nodes]
    case :mnesia.create_table(:feature, tab_def) do
      {:atomic, :ok}      -> :ok
      {:aborted, reason}  -> {:error, reason}
    end
  end

  defp work!(:local, :webhook_table_created, work_nodes) do
    :application.ensure_started(:mnesia)
    tab_def = [ attributes: [:id, :webhook], disc_copies: work_nodes]
    case :mnesia.create_table(:webhook, tab_def) do
      {:atomic, :ok}      -> :ok
                             {:aborted, reason}  -> {:error, reason}
    end
  end

  defp work!(:clustered, :schema_created, work_nodes) do
    mnesia_stop(work_nodes)

    [primary_node | _nodes] = work_nodes # not actually primary, just the first one
    :rpc.call(primary_node, :mnesia, :create_schema, [work_nodes])
  end

  defp work!(:clustered, :feature_table_created, work_nodes) do
    ensure_mnesia_started(work_nodes)

    [primary_node | _nodes] = work_nodes # not actually primary, just the first one
    tab_def = [ attributes: [:id, :feature], disc_copies: work_nodes]
    case :rpc.call(primary_node, :mnesia, :create_table, [:feature, tab_def]) do
      {:atomic, :ok}      -> :ok
      {:aborted, reason}  -> {:error, reason}
    end
  end

  defp work!(:clustered, :webhook_table_created, work_nodes) do
    ensure_mnesia_started(work_nodes)

    [primary_node | _nodes] = work_nodes # not actually primary, just the first one
    tab_def = [ attributes: [:id, :webhook], disc_copies: work_nodes]
    case :rpc.call(primary_node, :mnesia, :create_table, [:webhook, tab_def]) do
      {:atomic, :ok}      -> :ok
                             {:aborted, reason}  -> {:error, reason}
    end
  end

  defp ensure_nodes_online!(work_nodes) do
    bad_nodes = Enum.reject(work_nodes, &(Node.connect(&1)))
    unless bad_nodes == [] do
      Mix.shell.error("Could not connect to nodes: #{inspect bad_nodes}. Check all nodes are alive and accessible, then try again.")
      System.halt(1)
    end
  end

  defp ensure_mnesia_started(work_nodes) do
    multicall_ok = List.duplicate(:ok, length(work_nodes))
    {^multicall_ok, []} = :rpc.multicall(work_nodes, :application, :ensure_started, [:mnesia])
  end

  defp mnesia_stop(work_nodes) do
    multicall_stopped = List.duplicate(:stopped, length(work_nodes))
    {^multicall_stopped, []} = :rpc.multicall(work_nodes, :mnesia, :stop, [])
  end
end
