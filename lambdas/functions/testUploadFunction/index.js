const isOdd = require('is-odd');
const AWS = require('aws-sdk');

exports.handler = async (event) => {
    // TODO implement
    const response = {
        statusCode: 200,
        body: JSON.stringify('is odd 3? '+ isOdd(3) + 'sdk:' + AWS.VERSION),
    };
    return response;
};
