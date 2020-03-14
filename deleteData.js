'use strict';

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region:'ap-southeast-2'});

// Create the DynamoDB service object
const ddb = new AWS.DynamoDB.DocumentClient();

module.exports.delete = (event, context, callback) => {
  const data = JSON.parse(event.body);
  
  // create param with Table name and keys
  const params = {
    TableName: 'phonebook_example',
    Key: {
      contactNumber: data.contactNumber,
      contactName: data.contactName
    },
  }

  // fetch item from DDB
  ddb.delete(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error("Error: ", error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t delete the contact item.',
      });
      return;
    }

    // create a response with status code and body
    const response = {
      statusCode: 200,
      body: JSON.stringify('Item Deleted'),
    };
    callback(null, response);
  });
};
