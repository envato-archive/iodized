defmodule Iodized.Mixfile do
  use Mix.Project

  def project do
    [
      app: :iodized,
      version: "0.0.1",
      elixir: "~> 0.14.0",
      deps: deps
    ]
  end

  # Configuration for the OTP application
  def application do
    [
      mod: { Iodized, [] },
      applications: [:cowboy],
      env: [
        data_dir: :data,
        http_port: 8080,
        http_handler_count: 100,
        thrift_port: 5353
      ]
    ]
  end

  # Returns the list of dependencies in the format:
  # { :foobar, "~> 0.1", git: "https://github.com/elixir-lang/foobar.git" }
  defp deps do
    [
      {:cowboy, github: "extend/cowboy", tag: "0.9.0"},
      {:jsex, github: "talentdeficit/jsex", tag: "v2.0.0"},
      {:thrift, github: "envato/thrift-erlang", tag: "0.9.1.envato"}, # TODO need nicer way of managing thrift
      {:uuid, github: "avtobiff/erlang-uuid", tag: "v0.4.6"}
    ]
  end
end
