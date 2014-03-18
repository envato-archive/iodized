#!/bin/bash

echo "This command will setup your local dev environment"
mix deps.get
mix compile
echo "Done mixing!"
echo "Start app with \`iex -S mix\`"
