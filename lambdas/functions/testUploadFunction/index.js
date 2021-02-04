const isOdd = require('is-odd');

exports.handler = async (event) => {
    // TODO implement
    const response = {
        statusCode: 200,
        body: JSON.stringify('is odd 3? '+ isOdd(3)),
    };
    return response;
};
