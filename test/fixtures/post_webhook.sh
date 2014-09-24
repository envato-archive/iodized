#! /bin/bash

curl -X POST -H 'Content-Type:application/json' -v -d '{"event_type": "update", "url": "http://urlecho.appspot.com/echo?body={{message}}"}' 'http://localhost:8080/admin/api/webhooks'
