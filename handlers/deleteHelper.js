const http = require('http');
const fs = require('fs');
const updateIndex = require('./updateIndex.js');

function incomingDelete(request, response) {
  //find if file exists in dir
  fs.readdir('./public/', (err, data) => {
    //if no filenames match this element
    if(err) {
      throw err;
    }
    if(!data.some((filename)=> {
      return filename === request.url.slice(1);
    })) {
      response.writeHead(500, {
        'Content-Type' : 'application/json'
      });
      response.end(`{ "error" : "resource ${request.url} does not exist" }`);
      return;
    }

    fs.unlink(`./public${request.url}`, () => {
      updateIndex();
      response.writeHead(200, {
        'Content-Type' : 'application/json'
      });
      response.end('{ "success" : true }');
    });
  });
}

module.exports = incomingDelete;