const net = require('net');
const fs = require('fs');

const server = net.createServer((request) => {
  //handles data received
  console.log(request);
  request.on('data', (data) => {
    let requestType = data.toString().split(' ')[0];
    switch(requestType) {
      case 'GET':
        incomingGet(data, request);
        break;
      case 'POST':
        incomingPost(data, request);
        break;
    }
    request.write('data received');
  });

  //handles request ended
  request.on('end', () => {
    console.log('connection closed');
  });
});

//listen for events on port 8080
server.listen({port:8080}, () => {
  const address = server.address();
  console.log(`opened server on port ${address.port}`);
});

function incomingGet(data, request) {
  let uri = data.toString().split(' ')[1];
  console.log(uri);
  uri = 'public' + uri;
  fs.readFile(uri, 'utf8', (err, data) => {
    console.log('reading file');
    if(err) {
      console.log('404 error');
      request.write('404');
      return;
    }
    request.write(data);
  });
}

function incomingPost(data) {

}