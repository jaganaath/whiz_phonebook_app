'use strict';

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region:'ap-southeast-2'});

// Create the DynamoDB service object
const ddb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const data = JSON.parse(event.body);
  
  // set param with TableName and Items
  const params = {
    TableName: 'phonebook_example',
    Item: {
      contactNumber: data.contactNumber,
      contactName: data.contactName
    },
  };

  // write the item to the database
  ddb.put(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
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
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
};
