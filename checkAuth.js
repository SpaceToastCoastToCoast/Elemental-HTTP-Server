const http = require('http');
const buffer = require('buffer');
const correctCreds = require('./secret.js');

module.exports = function(request, response) {
  //isAuth can have three states: No auth, Incorrect auth, Correct auth
  if(!request.headers.hasOwnProperty('authorization')) {
    return null;
  } else {
    let secretCode = request.headers.authorization.slice(6);
    let b64Buffer = new Buffer(secretCode, 'base64');
    if(b64Buffer.toString() === correctCreds) {
      return true;
    }
    return false;
  }
};