defmodule Iodized.Mixfile do
  use Mix.Project

  def project do
    [
      app: :iodized,
      version: "0.0.1",
      elixir: "~> 1.0.0",
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
        thrift_port: 5353,
        thrift_ip: :any # may need to be '0.0.0.0' or '::1' if you get ipv4 vs ipv6 weirdness
      ]
    ]
  end

  # Returns the list of dependencies in the format:
  # { :foobar, "~> 0.1", git: "https://github.com/elixir-lang/foobar.git" }
  defp deps do
    [
      {:cowboy, "~> 1.0.0"},
      {:jsex, "~> 2.0.0"},
      {:thrift, github: "envato/thrift-erlang", tag: "0.9.1.envato"}, # TODO need nicer way of managing thrift
      {:uuid, "~> 0.1.5"},
      {:timex, "~> 0.12.7"},
      {:httpoison, "~> 0.4"}
    ]
  end
end
