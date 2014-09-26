![Iodized logo](https://i.imgur.com/lLJPXum.png)

Iodine rich [feature toggling](http://martinfowler.com/bliki/FeatureToggle.html)
by [envato](http://www.envato.com/). Lack of iodine can lead to development delays, and stunted growth.

[![Build Status](https://travis-ci.org/envato/iodized.png)](https://travis-ci.org/envato/iodized)

## Development status:

This is still very alpha quality, and not fully feature complete yet. It is undergoing heavy, regular development though, and is very close to being used in production at Envato.

If you're thinking about using Iodized, we would **LOVE** for you to tell us about it. Real users outside of Envato help enormously with deciding direction for Iodized. We're building this to solve our problems initially, but want it to solve common feature toggling problems across many organizations.

## Features:
- Handles high throughput of requests
- Flexible logic to allow for complex business rules _"this feature is on for
  these 4 sites, but only for 50% of users, and on for 20% of users on these
other 2 sites, but it's always on for these specific users, and always on for
users with these roles, and... and... or..."_
- User friendly admin UI
- Client/server architecture, so same features can be used across multiple
  services/apps running on different processes/servers/codebases
- Clustered config for high availability
- Clients for any language thrift supports (currently only [Ruby](https://github.com/envato/iodized_ruby_client) so far)
- No need to redeploy code, or directly manipulate datastore to control feature status

## usecases
- feature X is broken. I want to turn it off for all users, but on just me, so I
can test and fix problems before re-enabling for everyone
- launching new feature deployed across 8 out of 10 of the sites we host. We
only want to turn it on for a set of named users, and only on those sites.
- we're launching new experimental feature. we want to launch it to 1% of users,
  then gradually scale up
- we've got multiple apps serving all these usecases across multiple domains,
  and want to have one co-ordinated system to handle feature toggles across all of them


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
- can force feature on/off as a "panic button" to disable features having
  trouble during on-call work
- nice web UI to manage this
- nice web UI for reporting usage of each feature. Pluggable to different
  reporting backends

client (web) library
- needs to capture host/session/cookies via rack middleware etc
- custom logic to extract custom info (user details etc)
- end point to toggle on for session somehow
- simple interface to check if feature is on

## Getting Started

- Install Erlang/Elixir [using these
instructions](http://elixir-lang.org/install.html)
- `git clone https://github.com/envato/iodized.git`
- `cd iodized && ./script/setup.sh`
- open [http://localhost:8080](http://localhost:8080) for admin
- check out [iodized_ruby_client](https://github.com/envato/iodized_ruby_client)
  for how to use iodized in your code

## Development

### UI
- node/npm
- Ruby SASS gem installed
- from `priv/ui/` directory run `npm install`
- run `npm run gulp-build-dev` to build development version of assets
- run `npm run gulp` to build production version of assets
