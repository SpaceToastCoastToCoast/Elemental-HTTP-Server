const http = require('http');
const fs = require('fs');

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
      response.writeHead(200, {
        'Content-Type' : 'application/json'
      });
      response.end('{ "success" : true }');
    });
  });
}

function updateIndex() {
  let pageCount;
  fs.readdir('./public/', (err, data) => {
    pageCount = data.filter((element) => {
      return ['.keep', '404.html', 'index.html', 'css'].indexOf(element) === -1;
    });
    let linksList = pageCount.reduce((prev, curr) => {
      return prev + `<li><a href="${curr}">${curr.slice(0, -5)}</a></li>\n    `;
    }, "");
  let newIndex = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>The Elements</title>
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
  <h1>The Elements</h1>
  <h2>These are all the known elements.</h2>
  <h3>These are ${pageCount.length}</h3>
  <ol>
    ${linksList}
  </ol>
</body>
</html>`;
    fs.writeFile(`./public/index.html`, newIndex, (err) => {
      if (err) {
        throw err;
      }
    });
  });
}

module.exports = incomingDelete;