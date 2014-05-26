#!/usr/bin/env bash
HOSTNAME=`hostname -f`
APP=iodized
COOKIE=$APP@$HOSTNAME
elixir -S mix run --no-halt --name $COOKIE
