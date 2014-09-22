#!/bin/bash

echo "Mixing iodized..."
mix local.hex --force
mix deps.get
mix compile
mix iodized.install
echo "Done mixing!"
echo "Start app with \`iex -S mix\` and find the admin interface at http://localhost:8080"
