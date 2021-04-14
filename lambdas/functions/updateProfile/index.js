var AWS = require('aws-sdk');
const { getUid } = require('cognito-uid-from-jwd');

/**
 * Updates user profile
 */
exports.handler = async (event) => {
    // configure Dynamo
    AWS.config.update({region: 'us-east-1'});
    var ddb = new AWS.DynamoDB({apiVersion: '2019-11-21'});

    const userId = getUid(event);

    var data, statusCode, response;

    const paramName = event["queryStringParameters"]['name'];
    const paramEmail = event["queryStringParameters"]['email'];
    const paramBio = event["queryStringParameters"]['bio'];

    /*
    var params = {
        TableName: 'moodly',
        Item: {
            'PK' : {S: 'USER#'+userId},
            'SK' : {S: 'USER#'+userId},
            'screen_name' : {S: paramName},
            'uuid' : {S: userId},
            'email' : {S: paramEmail},
            'time' : {S: ''+new Date().getTime()},
            'body' : {S: paramBio}
        }
    };
    */

    var params = {
        TableName: "moodly",
        ExpressionAttributeNames: {'#name' : 'screen_name'},
        Key: {
            'PK' : {S: 'USER#'+userId},
            'SK' : {S: 'USER#'+userId}
        },
        UpdateExpression: "SET #name = :name, email = :email, body = :bio",
        ExpressionAttributeValues: {
            ":name": {S: paramName},
            ":email": {S: paramEmail},
            ":bio": {S: paramBio}
        },
        ReturnValues: "UPDATED_NEW"
    }

    try {
        data = await ddb.updateItem(params).promise();
        console.log("success");
        console.log(data);
        response = {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch(err) {
        console.log("Error ffuck");
        console.log(err);
        response = {
            statusCode: 500,
            body: JSON.stringify(err)
        };
    }

    return response;
};
