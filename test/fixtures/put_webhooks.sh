#! /bin/bash

curl -X PUT -H 'Content-Type:application/json' -v -d '{"update_feature_hooks": ["http://someurl.com/?msg={state}"], "add_feature_hooks": [], "delete_feature_hooks": []}' 'http://localhost:8080/admin/api/webhooks'
