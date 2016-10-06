const http = require('http');
const fs = require('fs');
const PORT = 8080;

let index;
let stylesheet;
let hydrogen;
let helium;
let notFound;

fs.readFile('./public/index.html', 'utf8', (err, data) => {
  index = data;
});
fs.readFile('./public/css/styles.css', 'utf8', (err, data) => {
  stylesheet = data;
});
fs.readFile('./public/hydrogen.html', 'utf8', (err, data) => {
  hydrogen = data;
});
fs.readFile('./public/helium.html', 'utf8', (err, data) => {
  helium = data;
});
fs.readFile('./public/404.html', 'utf8', (err, data) => {
  notFound = data;
});

const server = http.createServer((request, response) => {
  //handles data received
  console.log(request.method);
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
    case '/hydrogen.html':
    response.writeHead(200, {
      'Date' : new Date().toUTCString(),
      'Content-Type' : 'text/html; charset=utf-8'
    });
    response.write(hydrogen, 'utf8', () => {response.end();});
    break;
    case '/helium.html':
    response.writeHead(200, {
      'Date' : new Date().toUTCString(),
      'Content-Type' : 'text/html; charset=utf-8'
    });
    response.write(helium, 'utf8', () => {response.end();});
    break;
    default:
    response.writeHead(404, {
      'Date' : new Date().toUTCString(),
      'Content-Type' : 'text/html; charset=utf-8'
    });
    response.write(notFound, 'utf8', () => {response.end();});
    break;
  }

}).listen(PORT);


