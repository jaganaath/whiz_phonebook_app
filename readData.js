'use strict';

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region:'ap-southeast-2'});

// Create the DynamoDB service object
const ddb = new AWS.DynamoDB.DocumentClient();

module.exports.get = (event, context, callback) => {
  const data = JSON.parse(event.body); // *** Change - 1 *** For Postman testing //
  // const data = event.queryStringParameters; // *** Change - 2 *** For API gateway testing from browser //
  
  // set parameter with table name and key
  const params = {
    TableName: 'phonebook_example',
    Key: {
      // contactNumber: data.contactNumber // *** Change - 3 *** //
      contactNumber: parseInt(data.contactNumber) // *** Change - 4 *** For converting to integer. When enabling Change-2, comment Change - 3 and uncomment Change - 4 //
    },
  }
  
  // fetch item from DynamoDB
  ddb.get(params, (error, result) => {
    // handle potential errors
    if (error) {
      callback(null, {
        statusCode: error.statusCode || 501,
        // headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the contact item from DDB.',
      });
      return;
    }

    // create a response with status code and body
    const response = {
      statusCode: 200,
      headers: {'Access-Control-Allow-Origin' : '*'}, // For CORS
      body: JSON.stringify(result),
    };
    callback(null, response);
  });
};
