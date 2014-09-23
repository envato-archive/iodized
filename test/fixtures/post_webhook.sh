#! /bin/bash

curl -X POST -H 'Content-Type:application/json' -v -d '{"event_type": "update", "url": "http://someurl.com/?msg={{message}}"}' 'http://localhost:8080/admin/api/webhooks'

