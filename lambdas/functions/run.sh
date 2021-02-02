#!/bin/bash
: '
Executes lambda function

Parameters:
$1 First parameter needs to be the function name

@author Daniel Domínguez
    <cf19daniel.dominguez@iesjoandaustria.org>
'

if [ $# -eq 0 ]
  then
    echo "No arguments supplied"
    echo "First argument needs to be the function name"
    exit
fi

function_name=$1

if [ ! -z "$2" ] && [ $2 = "--log" ]
then
    aws lambda invoke --function-name $function_name functionoutput --log-type Tail --query 'LogResult' --output text |  base64 -d
else
    aws lambda invoke --function-name $function_name functionoutput --log-type Tail
fi


cat functionoutput

