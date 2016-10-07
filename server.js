const http = require('http');
const fs = require('fs');
const helpers = require('./handlers/');
console.log(helpers);
const PORT = 8080;
const methods = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
};
const server = http.createServer((request, response) => {
  //handles data received
  body = [];

  request.on('data', (data) => {
    if(request.method === methods.POST || request.method === methods.PUT) {
      body.push(data);
    }
  }).on('end', function() {
    body = Buffer.concat(body).toString();

    switch(request.method) {
      case methods.GET:
      helpers.getHelper(request, response);
      break;
      case methods.POST:
      helpers.postHelper(request, response, body);
      break;
      case methods.PUT:
      helpers.putHelper(request, response, body);
      break;
      case methods.DELETE:
      helpers.deleteHelper(request, response);
      break;
      default:
      response.statusCode = 405;
      response.end();
      break;
    }
  });

}).listen(PORT);

module.exports = server;