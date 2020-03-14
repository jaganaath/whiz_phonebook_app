'use strict';

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region:'ap-southeast-2'});

// Create the DynamoDB service object
const ddb = new AWS.DynamoDB.DocumentClient();

module.exports.list = (event, context, callback) => {

  // create param with Table name and limit to list data
  const params = {
    TableName: 'phonebook_example',
    Limit: 10
  }
  
  // fetch item from DynamoDB
  ddb.scan(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error("Error: ", error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the items.',
      });
      return;
    }

    // create a response with status code and body
    const response = {
      statusCode: 200,
      body: JSON.stringify(result),
    };
    callback(null, response);
  });
};
