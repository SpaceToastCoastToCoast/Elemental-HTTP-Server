const http = require('http');
const fs = require('fs');
const checkAuth = require('./checkAuth.js');
const updateIndex = require('./updateIndex.js');

function incomingPost(request, response, body) {
  if(checkAuth(request, response)) {
    let pairedData = {};
    let bodyDataArray = body.split('&');
    bodyDataArray.forEach((element) => {
      let pair = element.split('=');
      pairedData[pair[0]] = pair[1];
    });
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
    });
    updateIndex(pairedData.elementName);
    response.writeHead(200, {
      'Content-Type' : 'application/json'
    });
    response.end('{ "success" : true }');
  }
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

module.exports = incomingPost;