var AWS = require('aws-sdk');
const { getUid } = require('cognito-uid-from-jwd');
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event) => {
    // configure Dynamo
    AWS.config.update({region: 'us-east-1'});
    var ddb = new AWS.DynamoDB({apiVersion: '2019-11-21'});

    const userId = getUid(event);

    var data, statusCode, response;

    

    /** generate fresh uuidv4 **/
    var response = {
        statusCode: 200,
        body: JSON.stringify({ uuid: uuidv4()})
    };
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

    // Delete item
    /*
    var params = {
        TableName: 'moodly',
        Key: {
            'PK' : {S: 'PKTEST_24325325'},
            'SK' : {S: 'SKTEST_2021-03-02:16:55:45'}
        }
    };

    try {
        data = await ddb.deleteItem(params).promise();

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
    
    /*
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
        KeyConditionExpression: 'PK = :pkval AND begins_with(SK, :skval)',
        ExpressionAttributeValues: {
            ':pkval' : {S: 'PKTEST_24325325'},
            ':skval' : {S: 'SKTEST_2021'}
        },
    };

    try {
        data = await ddb.query(params).promise();
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
    return response;
};
