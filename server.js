const http = require('http');
const fs = require('fs');
const helpers = require('./handlers/');
const PORT = 8080;
const methods = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
};
const notAuth = "<html><body>Not Authorized</body></html>";
const invalidAuth = "<html><body>Invalid Authentication Credentials</body></html>";

const server = http.createServer((request, response) => {
  //handles data received
  body = [];

  request.on('data', (data) => {
    if(request.method === methods.POST || request.method === methods.PUT) {
      body.push(data);
    }
  }).on('end', function() {
    body = Buffer.concat(body).toString();
    let auth = helpers.checkAuth(request, response);

    switch(request.method) {
      case methods.GET:
      helpers.getHelper(request, response);
      break;
      case methods.POST:
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
        helpers.postHelper.incomingPost(request, response, body);
      }
      break;
      case methods.PUT:
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
        helpers.putHelper(request, response, body);
      }
      break;
      case methods.DELETE:
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
        helpers.deleteHelper(request, response);
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