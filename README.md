# Yodado

[![Build Status](https://travis-ci.org/envato/yodado.png)](https://travis-ci.org/envato/yodado)

## Getting Started

- Install Erlang/Elixir [using these
instructions](http://elixir-lang.org/getting_started/1.html)
- Run `mix deps.get`
- Run `mix compile`
- Start app with `iex -S mix`
- **PROFIT!**

## overview
app sends key/value pairs:
- `toggled on for session`
- `host`
- `username`
- `user_roles` (list)
- `cookies`
- `ip`
- `headers`
- `whatever`

config (like itunes smart list)
- list of "features". Each with:
-- any / all nodes
-- boolean test at leafs examining some specific key/value
- if decision tree is true, feature is on, otherwise off
- maybe support more results than just true/false
- nice web UI to manage this
- nice web UI for reporting usage of each feature. Pluggable to different
  reporting backends

client (web) library
- needs to capture host/session/cookies via rack middleware etc
- custom logic to extract custom info (user details etc)
- end point to toggle on for session somehow
- simple interface to check if feature is on

## usecases
- feature X is broken. I want to turn it off for all users, but on just me, so I
  can test and fix problems before re-enabling for everyone
- launching new feature deployed across 8 out of 10 of the sites we host. We
  only want to turn it on for a set of named users, and only on those sites.
- we're launching new experimental feature. we want to launch it to 1% of users,
  then gradually scale up
- we're launching new service, but don't know how it will perform. capture
  requests from production traffic, and async fire them at the new service
without affecting prod response.

## MVP
- web config UI
- logic for handling decision tree
- persistent backend storage. Probably Redis.
- client library to call yodado. Probably REST

## scope braindump
- dark launch traffic replay (redirect request to some other end point)
- auto scale up % over time
- detect errors, only increase % if successful are constant (or some other
  metric)
- dynamically define A/B feature and test options from client. Client has way to
  specify conversion results
- more transports than just REST (thrift, zeromq etc)
- more backends than just Redis
- app sends notifications of errors/timeouts/slowness on a feature. Automatically toggles it off
  if they get too high

## TODO
- endpoint for list of features
- endpoint for list of known params
- feature name/description/global state
- feature created if new one requested in do?
- param names stored when passed in do? request
