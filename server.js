const net = require('net');
const fs = require('fs');

function okHeader() {
  let now = new Date();
  return "HTTP/1.1 200 OK\nServer: nginx/1.4.6 (Ubuntu)\n" +
  'Date: ' + now.toUTCString() + '\n' +
  'Content-Type: text/html; charset=utf-8\n\n';
}
function cssHeader() {
  let now = new Date();
  return "HTTP/1.1 200 OK\nServer: nginx/1.4.6 (Ubuntu)\n" +
  'Date: ' + now.toUTCString() + '\n' +
  'Content-Type: text/css; charset=utf-8\n\n';
}
function notFoundHeader() {
  let now = new Date();
  return "HTTP/1.0 404 Not Found\nServer: nginx/1.4.6 (Ubuntu)\n" +
  'Date: ' + now.toUTCString() + '\n' +
  'Content-Type: text/html; charset=utf-8\n\n';
}

let index = okHeader();
let stylesheet = cssHeader();
let hydrogen = okHeader();
let helium = okHeader();
let notFound = notFoundHeader();

fs.readFile('./public/index.html', 'utf8', (err, data) => {
  index += data;
});
fs.readFile('./public/css/styles.css', 'utf8', (err, data) => {
  stylesheet += data;
});
fs.readFile('./public/hydrogen.html', 'utf8', (err, data) => {
  hydrogen += data;
});
fs.readFile('./public/helium.html', 'utf8', (err, data) => {
  helium += data;
});
fs.readFile('./public/404.html', 'utf8', (err, data) => {
  notFound += data;
});

const server = net.createServer((request) => {
  //handles data received
  request.on('data', (data) => {
    console.log(data.toString());
    let uri = './public' + data.toString().split(' ')[1];
    console.log(uri);
    switch(uri) {
      case './public/':
      request.write(index, 'utf8', () => {request.end();});
      break;
      case './public/index.html':
      request.write(index, 'utf8', () => {request.end();});
      break;
      case './public/css/styles.css':
      request.write(stylesheet, 'utf8', () => {request.end();});
      break;
      case './public/hydrogen.html':
      request.write(hydrogen, 'utf8', () => {request.end();});
      break;
      case './public/helium.html':
      request.write(helium, 'utf8', () => {request.end();});
      break;
      default:
      console.log(404);
      request.write(notFound, 'utf8', () => {request.end();});
      break;
    }

  });

  //handles request ended
  request.on('end', () => {
    console.log('connection closed');
  });

  request.on('error', () => {
    request.end();
  });
});

//listen for events on port 8080
server.listen({port:8080}, () => {
  const address = server.address();
  console.log(`opened server on port ${address.port}`);
});

