defmodule Mix.Tasks.Yodado.Install do
  use Mix.Task

  @shortdoc "set up yodado"

  def run(_) do
    if :application.get_env(:mnesia, :dir) == :undefined do
      data_dir = (:os.getenv("DATA_DIR") || 'data') |>
        iolist_to_binary |>
        binary_to_atom
      :application.set_env(:mnesia, :dir, data_dir)
    end

    IO.puts "creating schema in #{data_dir}"
    IO.inspect :mnesia.create_schema([node()])

    IO.puts "starting mnesia"
    IO.inspect :ok = :mnesia.start()

    IO.puts "creating features table"
    feature_attributes = Yodado.Feature.Feature.__record__(:fields) |> Keyword.keys
    IO.inspect :mnesia.create_table(Yodado.Feature.Feature, [
      attributes: feature_attributes,
      disc_copies: [node()]])

    :mnesia.wait_for_tables([:features], 5000)

    IO.puts "stopping mnesia"
    IO.inspect :stopped = :mnesia.stop()

  end
end
