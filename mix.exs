defmodule Yodado.Mixfile do
  use Mix.Project

  def project do
    [
      app: :yodado,
      version: "0.0.1",
      elixir: "~> 0.13.1",
      deps: deps
    ]
  end

  # Configuration for the OTP application
  def application do
    [
      mod: { Yodado, [] },
      applications: [:cowboy],
      env: [data_dir: :data]
    ]
  end

  # Returns the list of dependencies in the format:
  # { :foobar, "~> 0.1", git: "https://github.com/elixir-lang/foobar.git" }
  defp deps do
    [
      {:cowboy, github: "extend/cowboy", tag: "0.9.0"},
      {:jsex, github: "talentdeficit/jsex", tag: "v2.0.0"},
      {:thrift, github: "envato/thrift-erlang", tag: "0.9.1.envato"} # TODO need nicer way of managing thrift
    ]
  end
end
