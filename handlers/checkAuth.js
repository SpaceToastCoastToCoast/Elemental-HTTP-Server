const http = require('http');
const buffer = require('buffer');
const correctCreds = require('../secret.js');
const notAuth = "<html><body>Not Authorized</body></html>";
const invalidAuth = "<html><body>Invalid Authentication Credentials</body></html>";

function authorize(request, response) {
  //isAuth can have three states: No auth, Incorrect auth, Correct auth
  if(!request.headers.hasOwnProperty('authorization')) {
    response.writeHead(401, {
      'WWW-Authenticate' : 'Basic realm="Secure Area"'
    });
    response.end(notAuth);
    return null;
  } else {
    let secretCode = request.headers.authorization.slice(6);
    let b64Buffer = new Buffer(secretCode, 'base64');
    if(b64Buffer.toString() === correctCreds) {
      return true;
    }
    response.writeHead(401, {
      'WWW-Authenticate' : 'Basic realm="Secure Area"'
    });
    response.end(invalidAuth);
    return false;
  }
}

module.exports = authorize;