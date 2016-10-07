const app = require('../');
const supertest = require("supertest")(app);
const fs = require("fs");
const secret = require('../secret.js');

describe("element server GET", function(){
  let index, notFound;
  beforeEach(function() {
    index = fs.readFileSync('./public/index.html', 'utf8');
    notFound = fs.readFileSync('./public/404.html', 'utf8');
  });

  it("gives the index page when / is requested", function(done) {
    supertest
      .get("/")
      .expect(200)
      .expect(index)
      .end(done);
  });

  it("gives the index page when /index.html is requested", function(done) {
    supertest
      .get("/index.html")
      .expect(200)
      .expect(index)
      .end(done);
  });

  it("gives a 404 when a nonexistent page is requested", function(done) {
    supertest
    .get("/butts.html")
    .expect(404)
    .expect(notFound)
    .end(done);
  });
});

describe("element server POST", function() {
  it("returns an error if no credentials are provided", function(done) {
    supertest
    .post("/elements")
    .set("Content-Type", "application/x-www-form-urlencoded")
    .type("form")
    .send('elementName=Boron')
    .send('elementSymbol=B')
    .send('elementAtomicNumber=5')
    .send('elementDescription=Boron is found in Turkey.')
    .expect(401)
    .end(done);
  });

  it("returns an error if improper credentials are provided", function(done) {
    supertest
    .post("/elements")
    .set("Authorization", "Basic ZG7nZTp3b2Zl")
    .set("Content-Type", "application/x-www-form-urlencoded")
    .type("form")
    .send('elementName=Boron')
    .send('elementSymbol=B')
    .send('elementAtomicNumber=5')
    .send('elementDescription=Boron is found in Turkey.')
    .expect(401)
    .end(done);
  });

  it("returns a success message if proper credentials are provided", function(done) {
    supertest
    .post("/elements")
    .set("Authorization", "Basic ZG9nZTp3b2Zl")
    .set("Content-Type", "application/x-www-form-urlencoded")
    .type("form")
    .send('elementName=Boron')
    .send('elementSymbol=B')
    .send('elementAtomicNumber=5')
    .send('elementDescription=Boron is found in Turkey.')
    .expect(200)
    .end(done);
  });

  it("creates a page from data in POST body", function(done) {
    supertest
    .get("/boron.html")
    .expect(200)
    .end(done);
  });

});

describe("element server PUT", function() {
  it("returns an error if no credentials are provided", function(done) {
    supertest
    .put("/boron.html")
    .set("Content-Type", "application/x-www-form-urlencoded")
    .type("form")
    .send('elementName=Boron')
    .send('elementSymbol=B')
    .send('elementAtomicNumber=5')
    .send('elementDescription=Boron is a common element found in Turkey.')
    .expect(401)
    .end(done);
  });

  it("returns an error if improper credentials are provided", function(done) {
    supertest
    .put("/boron.html")
    .set("Authorization", "Basic ZG7nZTp3b2Zl")
    .set("Content-Type", "application/x-www-form-urlencoded")
    .type("form")
    .send('elementName=Boron')
    .send('elementSymbol=B')
    .send('elementAtomicNumber=5')
    .send('elementDescription=Boron is a common element found in Turkey.')
    .expect(401)
    .end(done);
  });

  it("returns a failure message if the page does not exist", function(done) {
    supertest
    .put("/butts.html")
    .set("Authorization", "Basic ZG9nZTp3b2Zl")
    .set("Content-Type", "application/x-www-form-urlencoded")
    .type("form")
    .send('elementName=Boron')
    .send('elementSymbol=B')
    .send('elementAtomicNumber=5')
    .send('elementDescription=Boron is a common element found in Turkey.')
    .expect(500)
    .end(done);
  });

  it("returns a success message if proper credentials are provided and the page exists", function(done) {
    supertest
    .put("/boron.html")
    .set("Authorization", "Basic ZG9nZTp3b2Zl")
    .set("Content-Type", "application/x-www-form-urlencoded")
    .type("form")
    .send('elementName=Boron')
    .send('elementSymbol=B')
    .send('elementAtomicNumber=5')
    .send('elementDescription=Boron is a common element found in Turkey.')
    .expect(200)
    .end(done);
  });

  it("modifies a page from data in PUT body", function(done) {
    supertest
    .get("/boron.html")
    .expect(200)
    .end(done);
  });
});

describe("element server DELETE", function() {
  it("returns an error if no credentials are provided", function(done) {
    supertest
    .del("/boron.html")
    .expect(401)
    .end(done);
  });

  it("returns an error if improper credentials are provided", function(done) {
    supertest
    .del("/boron.html")
    .set("Authorization", "Basic ZG7nZTp3b2Zl")
    .expect(401)
    .end(done);
  });

  it("returns a failure message if the page does not exist", function(done) {
    supertest
    .del("/butts.html")
    .set("Authorization", "Basic ZG9nZTp3b2Zl")
    .expect(500)
    .end(done);
  });

  it("returns a success message if proper credentials are provided and the page exists", function(done) {
    supertest
    .del("/boron.html")
    .set("Authorization", "Basic ZG9nZTp3b2Zl")
    .expect(200)
    .end(done);
  });

  it("removes the resource at the specified url", function(done) {
    supertest
    .get("/boron.html")
    .expect(404)
    .end(done);
  });
});