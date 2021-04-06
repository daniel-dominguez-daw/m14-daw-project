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
            
                const profileData = {
                    'PK' : 'USER#'+userId,
                    'SK' : 'USER#'+userId,
                    'screen_name' : 'User ' + userId,
                    'uuid' : userId,
                    'email' : 'example@example.com',
                    'time' : ''+new Date().getTime(),
                    'body' : 'Fill your BIO',
                    'WS_uuids' : ['null'],
                    'WS_names' : ['null']
                };

                var createUserParams = {
                    TableName: 'moodly',
                    Item: {
                        'PK' : {S: profileData.PK},
                        'SK' : {S: profileData.SK},
                        'screen_name' : {S: profileData.screen_name},
                        'uuid' : {S: profileData.uuid},
                        'email' : {S: profileData.email},
                        'time' : {S: profileData.time},
                        'body' : {S : profileData.body},
                        'WS_uuids' : {SS : profileData.WS_uuids},
                        'WS_names' : {SS : profileData.WS_names}
                    }
                };

                var createUserData = await ddb.putItem(createUserParams).promise();
                console.log("success");
                console.log(createUserData);
            
                response = {
                    statusCode: 200,
                    body: JSON.stringify({
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
