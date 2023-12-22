#!/bin/bash

export LANG=en_US.UTF-8

# Step 1: Get the list of items to delete
item_keys=$(aws dynamodb scan \
    --table-name funds \
    --filter-expression "creatorId = :creator" \
    --expression-attribute-values '{ ":creator": { "S": "Timo Travel" } }' \
    --endpoint-url http://localhost:8000 \
    --query "Items[].fundId.S" \
    --output text)

# while read -r fund_id; do
#     echo "$fund_id"
#     aws dynamodb delete-item \
#         --table-name funds \
#         --key '{"fundId": {"S": "'"$fund_id"'"}, "creatorId": {"S": "122048a2-435c-4231-8999-e0933c87a084"}}' \
#         --endpoint-url http://localhost:8000
# done <<< "$item_keys"

aws dynamodb delete-item \
    --table-name funds \
    --key '{"fundId": {"S": "2b3d045e-48dc-4cef-9e95-ada2c0369018"}, "creatorId": {"S": "122048a2-435c-4231-8999-e0933c87a084"}}' \
    --endpoint-url http://localhost:8000

aws dynamodb update-table \
	--table-name funds \
	--attribute-definitions AttributeName=userId,AttributeType=S \
	--global-secondary-index-updates \
		'[{"Create":{"IndexName": "fund-id-index","KeySchema":[{"AttributeName":"fundId","KeyType":"HASH"}], "ProvisionedThroughput": {"ReadCapacityUnits": 5, "WriteCapacityUnits": 5} ,"Projection":{"ProjectionType":"ALL"}}}]' \
	--endpoint-url http://localhost:8000 