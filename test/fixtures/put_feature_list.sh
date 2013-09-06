curl -X PUT -H 'Content-Type:application/json' -v -d @`dirname $0`/example_feature_list.json 'http://localhost:8080/admin/api/features'
