#!/bin/bash
'
    creates an authorizer JWT for an api
'

if [[ "$#" -lt 2 ]]; then
    echo "ilegal number of arguments";
    echo "required: authorizer-name api-id";
    exit
fi

audience="7tpgrtnd1r2nsej9nt0gg8cj1a"
issuer="https://cognito-idp.us-east-1.amazonaws.com/us-east-1_JKyQyHbXl"

aws apigatewayv2 create-authorizer \
    --name $1 \
    --api-id $2 \
    --authorizer-type JWT \
    --identity-source '$request.header.Authorization' \
    --jwt-configuration Audience=$audience,Issuer=$issuer
