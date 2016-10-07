const http = require('http');
const fs = require('fs');

function updateIndex() {
  let pageCount;
  fs.readdir('./public/', (err, data) => {
    pageCount = data.filter((element) => {
      return ['.keep', '404.html', 'index.html', 'css'].indexOf(element) === -1;
    });
    let linksList = pageCount.map((el) => {
      return `<li><a href="${el}">${el.slice(0, -5)}</a></li>`;
    }).join("\n");
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

module.exports = updateIndex;