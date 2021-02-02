#!/bin/bash
: '
Prepares zip deployment package
Uploads zip to aws lambda functions

Parameters:
$1 First parameter needs to be the function name (and folder name)

@author Daniel Domínguez
    <cf19daniel.dominguez@iesjoandaustria.org>
'

if [ $# -eq 0 ]
  then
    echo "No arguments supplied"
    echo "First argument needs to be the function name"
    echo "Function name has to exist as a folder in this directory"
    exit
fi

function_name=$1

[ ! -d "$function_name" ] && echo "Directory $function_name DOES NOT exists." && exit

echo "Packaging $function_name..."

cd $function_name
zip -r ../${function_name}.zip *

echo "Uploading package to AWS Lambda..."

cd ..

zip_path=`readlink -f ${function_name}.zip`

aws lambda update-function-code --function-name $function_name --zip-file fileb://${zip_path}

echo "Done!\n"
