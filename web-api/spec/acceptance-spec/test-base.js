var proxy = require('express-http-proxy');
var request = require('supertest');
var app = require('express')();
var fs = require("fs");
var glob = require("glob");
var path = require("path");
var async = require("async");
var shelljs = require("shelljs");
var should = require("should");

var externalTest = require("./external-test");

var serverAddr = "http://localhost:8080";

app.use(proxy(serverAddr, {
  forwardPath: function(req, res) {
    return '/paper-api' + require('url').parse(req.url).path;
  }
}));

app.listen(3333);

function buildspec(data, done) {
  var method = data.request.method || 'get';
  var postData = data.request.json;
  var queryData = data.request.query;
  var responseStatus = data.response.status || 200;
  console.log(responseStatus);
  var contentSpecFunc = externalTest[data.description] || function(res) {
    res.body.should.deepEqual(data.response.json);
  };

  console.log(`
[${method}] `+data.request.uri);
  request(app)[method](data.request.uri)
    .query(queryData)
    .send(postData)
    .expect(responseStatus)
    .expect(contentSpecFunc)
    .end(function(err, res) {
      if(method !== 'get') {
        shelljs.exec("docker exec -i assembly_mysql_1 mysql -u BronzeSword -p12345678 BronzeSword < mysql.sql", {
          silent: true
        });
      }
      done(err);
    });
}

var files = glob.sync(__dirname + "/../support/mock-api/paper-api/**/*.json");

var data = files.map((file)=> {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
});

data = data.reduce((a, b)=> {
  return a.concat(b);
});

describe("paper-api:", function() {

  before(() => {
    shelljs.exec("docker exec -i assembly_mysql_1 mysqldump -u BronzeSword -p12345678 BronzeSword > mysql.sql", {
      silent: true
    });
  });

  data.forEach((specData)=> {
    it(specData.description, (function(specData) {
      return function(done) {
        buildspec(specData, done);
      }
    })(specData));
  })

});
