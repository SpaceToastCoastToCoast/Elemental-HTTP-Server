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
  body = [];
  request.on('data', (data) => {
    if(request.url === '/elements') {
      body.push(data);
    }
  }).on('end', function() {
    body = Buffer.concat(body).toString();

    switch(request.method) {
      case 'GET':
      incomingGet(request, response);
      break;
      case 'POST':
      if(request.url === '/elements') {
        incomingPost(request, response, body);
      }
      break;
      default:
      response.statusCode = 405;
      response.end();
      break;
    }
  });

}).listen(PORT);

function incomingGet(request, response) {
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
}

function incomingPost(request, response, body) {
  let pairedData = {};
  console.log(body);
  let bodyDataArray = body.split('&');
  console.log(bodyDataArray);
  bodyDataArray.forEach((element) => {
    let pair = element.split('=');
    pairedData[pair[0]] = pair[1];
  });
  console.log(pairedData);
  //now verify the data
  if(!pairedData.hasOwnProperty('elementName') || !pairedData.hasOwnProperty('elementSymbol') ||
    !pairedData.hasOwnProperty('elementAtomicNumber') || !pairedData.hasOwnProperty('elementDescription')) {
    response.statusCode = 400;
    response.end();
    return;
  }
  pairedData.elementDescription = pairedData.elementDescription.split('+').join(' ');
  let generatedPage = makeElementPage(pairedData);
  //now write to fs
  fs.writeFile(`./public/${pairedData.elementName.toLowerCase()}.html`, generatedPage, (err) => {
    if (err) {
      throw err;
    }
    console.log('Created file');
  });
  updateIndex(pairedData.elementName);
  response.writeHead(200, {
    'Content-Type' : 'application/json'
  });
  response.end('{ "success" : true }');
}

function makeElementPage(elementObject) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>The Elements - ${elementObject.elementName}</title>
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
  <h1>${elementObject.elementName}</h1>
  <h2>${elementObject.elementSymbol}</h2>
  <h3>Atomic number ${elementObject.elementAtomicNumber}</h3>
  <p>${elementObject.elementDescription}</p>
  <p><a href="/">back</a></p>
</body>
</html>`;
}

function updateIndex(elementName) {
  let pageCount;
  fs.readdir('./public/', (err, data) => {
    pageCount = data.filter((element) => {
      console.log('element inside fs.readdir', element);
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
      console.log('Created file');
    });
  });
}