var AWS = require('aws-sdk');
const { getUid } = require('cognito-uid-from-jwd');

/**
 * Tries to GET user data from dynamoDB
 * If the user exists, returns profile data
 * If the user doesn't exists, creates a new profile, returns new profile
 *
 */
exports.handler = async (event) => {
    // configure Dynamo
    AWS.config.update({region: 'us-east-1'});
    var ddb = new AWS.DynamoDB({apiVersion: '2019-11-21'});

    const userId = getUid(event);

    var data, statusCode, response;

    // Put item (INSERT)
    /*
    var params = {
        TableName: 'moodly',
        Item: {
            'PK' : {S: 'PKTEST_24325325'},
            'SK' : {S: 'SKTEST_2021-03-02:16:55:45'},
            'uuid' : {S: userId}
        }
    };

    try {
        data = await ddb.putItem(params).promise();
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

    */

    // Select data from main table or index
    // @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html
    
    var params = {
        TableName: 'moodly',
        // Query index
//        IndexName: 'uuid-index',
//        ExpressionAttributeNames: {'#UUID' : 'uuid'},
//        KeyConditionExpression: '#UUID = :uuidval',
//        ExpressionAttributeValues: {
//            ':uuidval' : {S: 'd286289b-82be-4b53-95b7-654ac86c7a15'}
//        },
        // Query main table PK and SK
        KeyConditionExpression: 'PK = :pkval AND SK = :skval',
        ExpressionAttributeValues: {
            ':pkval' : {S: 'USER#'+ userId},
            ':skval' : {S: 'USER#'+ userId}
        },
    };

    try {
        data = await ddb.query(params).promise();
        console.log(data);
        if(data.Count === 0) {
            // User with that uuid not created yet
            // Create user
            
            const paramName = event["queryStringParameters"]['name'];
            const paramEmail = event["queryStringParameters"]['email'];

                const profileData = {
                    'PK' : {S: 'USER#'+userId},
                    'SK' : {S: 'USER#'+userId},
                    'screen_name' : {S: paramName},
                    'uuid' : {S: userId},
                    'email' : {S: paramEmail},
                    'time' : {S: ''+new Date().getTime()},
                    'body' : {S: 'Fill your BIO'},
                    'WS_uuids' : {SS: ['null']},
                    'WS_names' : {SS: ['null']}
                };

                var createUserParams = {
                    TableName: 'moodly',
                    Item: profileData
                };

                var createUserData = await ddb.putItem(createUserParams).promise();
                console.log("success");
                console.log(createUserData);
            
                response = {
                    statusCode: 200,
                    body: JSON.stringify({
                        ev: event,
                        Items : [profileData],
                        Count : 1})
                };
        } else {
            // returns found user data
            response = {
                statusCode: 200,
                body: JSON.stringify(data)
            };
        }
    } catch(err) {
        console.log("Get user went wrong");
        console.log(err);
        response = {
            statusCode: 500,
            body: JSON.stringify(err)
        };
    }

    return response;
};
