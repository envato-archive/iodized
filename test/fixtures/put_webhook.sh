#! /bin/bash

curl -X PUT -H 'Content-Type:application/json' -v -d '{"id": "98d50215-2334-47e3-9848-de21c2fce023", "event_type": "update", "url": "http://someurl2.com/?msg={{message}}"}' 'http://localhost:8080/admin/api/webhooks/98d50215-2334-47e3-9848-de21c2fce023'
