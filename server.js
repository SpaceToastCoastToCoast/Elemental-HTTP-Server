const http = require('http');
const fs = require('fs');
const postHelper = require('./postHelper.js');
const getHelper = require('./getHelper.js');
const putHelper = require('./putHelper.js');
const PORT = 8080;

const server = http.createServer((request, response) => {
  //handles data received
  body = [];
  request.on('data', (data) => {
    if(request.url === '/elements') {
      body.push(data);
    }
  }).on('end', function() {
    body = Buffer.concat(body).toString();

    switch(request.method) {
      case 'GET':
      getHelper(request, response);
      break;
      case 'POST':
      if(request.url === '/elements') {
        postHelper.incomingPost(request, response, body);
      }
      break;
      case 'PUT':
      putHelper(request, response, body);
      break;
      default:
      response.statusCode = 405;
      response.end();
      break;
    }
  });

}).listen(PORT);