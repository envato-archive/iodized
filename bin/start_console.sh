#!/usr/bin/env bash
HOSTNAME=`hostname -f`
APP=iodized
COOKIE=$APP@$HOSTNAME
iex --name $COOKIE -S mix
