defmodule Yodado.Mixfile do
  use Mix.Project

  def project do
    [ 
      app: :yodado,
      version: "0.0.1",
      elixir: "~> 0.10.2-dev",
      deps: deps
    ]
  end

  # Configuration for the OTP application
  def application do
    [ 
      mod: { Yodado.Web, [] },
      applications: [:cowboy],
    ]
  end

  # Returns the list of dependencies in the format:
  # { :foobar, "~> 0.1", git: "https://github.com/elixir-lang/foobar.git" }
  defp deps do
    [ 
      {:cowboy, github: "extend/cowboy"},
      {:mimetypes, github: "spawngrid/mimetypes"}
    ]
  end
end
