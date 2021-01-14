#!/bin/bash
'
    Authorizes an api route
'
if [[ "$#" -lt 3 ]]; then
    echo "ilegal number of arguments";
    echo "required: api-id route-id authorizer-id";
    exit
fi

aws apigatewayv2 update-route \
   --api-id $1  \
   --route-id $2  \
   --authorization-type JWT \
   --authorizer-id $3 \
   --authorization-scopes user.id user.email  
