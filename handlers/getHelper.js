const http = require('http');
const fs = require('fs');

let index;
let stylesheet;
let notFound;

fs.readFile('./public/index.html', 'utf8', (err, data) => {
  index = data;
});
fs.readFile('./public/css/styles.css', 'utf8', (err, data) => {
  stylesheet = data;
});
fs.readFile('./public/404.html', 'utf8', (err, data) => {
  notFound = data;
});

module.exports = function (request, response) {
  switch(request.url) {
    case '/':
    response.writeHead(200, {
      'Date' : new Date().toUTCString(),
      'Content-Type' : 'text/html; charset=utf-8'
    });
    response.write(index, 'utf8', () => {response.end();});
    break;
    case '/index.html':
    response.writeHead(200, {
      'Date' : new Date().toUTCString(),
      'Content-Type' : 'text/html; charset=utf-8'
    });
    response.write(index, 'utf8', () => {response.end();});
    break;
    case '/css/styles.css':
    response.writeHead(200, {
      'Date' : new Date().toUTCString(),
      'Content-Type' : 'text/css; charset=utf-8'
    });
    response.write(stylesheet, 'utf8', () => {response.end();});
    break;
    default:
    fs.readFile(`./public${request.url}`, (err, data) => {
      if(err) {
        response.writeHead(404, {
          'Date' : new Date().toUTCString(),
          'Content-Type' : 'text/html; charset=utf-8'
        });
        response.write(notFound, 'utf8', () => {response.end();})
      } else {
        response.writeHead(200, {
          'Date' : new Date().toUTCString(),
          'Content-Type' : 'text/html; charset=utf-8'
        });
        response.write(data, 'utf8', () => {response.end();});
      }
    });
    break;
  }
};