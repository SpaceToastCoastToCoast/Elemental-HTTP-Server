const http = require('http');
const fs = require('fs');
const postHelper = require('./postHelper.js');
const getHelper = require('./getHelper.js');
const putHelper = require('./putHelper.js');
const deleteHelper = require('./deleteHelper.js');
const checkAuth = require('./checkAuth.js');
const PORT = 8080;
const notAuth = "<html><body>Not Authorized</body></html>";
const invalidAuth = "<html><body>Invalid Authentication Credentials</body></html>";

const server = http.createServer((request, response) => {
  //handles data received
  body = [];

  request.on('data', (data) => {
    if(request.url === '/elements') {
      body.push(data);
    }
  }).on('end', function() {
    body = Buffer.concat(body).toString();
    let auth = checkAuth(request, response);

    switch(request.method) {
      case 'GET':
      getHelper(request, response);
      break;
      case 'POST':
      if(auth === null) {
        response.writeHead(401, {
          'WWW-Authenticate' : 'Basic realm="Secure Area"'
        });
        response.end(notAuth);
      } else if(!auth) {
        response.writeHead(401, {
          'WWW-Authenticate' : 'Basic realm="Secure Area"'
        });
        response.end(invalidAuth);
      } else if(request.url === '/elements') {
        postHelper.incomingPost(request, response, body);
      }
      break;
      case 'PUT':
      if(auth === null) {
        response.writeHead(401, {
          'WWW-Authenticate' : 'Basic realm="Secure Area"'
        });
        response.end(notAuth);
      } else if(!auth) {
        response.writeHead(401, {
          'WWW-Authenticate' : 'Basic realm="Secure Area"'
        });
        response.end(invalidAuth);
      } else {
        putHelper(request, response, body);
      }
      break;
      case 'DELETE':
      if(auth === null) {
        response.writeHead(401, {
          'WWW-Authenticate' : 'Basic realm="Secure Area"'
        });
        response.end(notAuth);
      } else if(!auth) {
        response.writeHead(401, {
          'WWW-Authenticate' : 'Basic realm="Secure Area"'
        });
        response.end(invalidAuth);
      } else {
        deleteHelper(request, response);
      }
      break;
      default:
      response.statusCode = 405;
      response.end();
      break;
    }
  });

}).listen(PORT);

module.exports = server;