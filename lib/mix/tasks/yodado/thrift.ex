defmodule Mix.Tasks.Yodado.Thrift do
  use Mix.Task

  @shortdoc "generate thrift erlang boilerplate"

  def run(_) do
    IO.puts System.cmd("thrift -out src -gen erl -verbose priv/feature.thrift")
  end
end
