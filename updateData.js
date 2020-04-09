'use strict';

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region:'ap-southeast-2'});

// Create the DynamoDB service object
const ddb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
  const data = JSON.parse(event.body);
  
  // Create param
  const params = {
    TableName: 'phonebook_example',
    Key: {
      contactNumber: data.contactNumber
    },
    UpdateExpression: "set contactName=:contactName",
    ExpressionAttributeValues:{
        ":contactName": data.contactName
    },
    ReturnValues:"ALL_NEW"
  };

  // write the item to the database
  ddb.update(params, (error) => {
    // handle potential errors
    if (error) {
      console.error("Error: ", error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t create the item.',
      });
      return;
    }

    // create a response with status code and body
    const response = {
      statusCode: 200,
      headers: {'Access-Control-Allow-Origin' : '*'}, // For CORS
      body: JSON.stringify('Item Updated'),
    };
    callback(null, response);
  });
}
