const app = require('../');
const supertest = require("supertest")(app);
const fs = require("fs");

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