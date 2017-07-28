'use strict';
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var route = require('./routes/route');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoConn = require('./services/mongo-conn');
var MongoStore = require('connect-mongo')(session);
var config = require('config');
var captcha = require('./middleware/captcha');
var verifyToken = require('./middleware/verify-token');
var mongoExpress = require('mongo-express/lib/middleware');
var mongoExpressConfig = require('./config.default');

var env = ['production', 'test', 'show-case', 'staging', 'integration'].indexOf(process.env.NODE_ENV) < 0 ? 'default' : process.env.NODE_ENV;
var randomCaptchaEnv = ['production', 'staging', 'show-case'];

app.use('/mongo_express', mongoExpress(mongoExpressConfig));
app.use(cookieParser());
app.use(session({
  secret: 'RECRUITING_SYSTEM', resave: false, saveUninitialized: false,
  store: new MongoStore({
    url: config.get('database'),
    ttl: config.get('sessionTtl')
  })
}));

app.use(bodyParser.urlencoded({
  extended: false
}));

var params = {
  'url': '/captcha.jpg',
  'color': '#ffffff',
  'background': '#000000',
  'lineWidth': 1,
  'fontSize': 25,
  'codeLength': 4,
  'canvasWidth': 72,
  'canvasHeight': 34
};

if (randomCaptchaEnv.every(item => item !== env)) {
  params.text = '1234';
}

app.use(captcha(params));

app.use(bodyParser.json());
app.use(verifyToken);
route.setRoutes(app);

app.use((err, req, res, next) => {
  if (err) {
    return next(err);
  }
  res.status(404).send('Not Found!');
});

app.use((err, req, res, next) => {
  if (err) {
    res.status(500).send(err.stack);
  }
});

app.listen(config.get('port'), () => {
  const info = `
Current environment is: ${env}
App started at http://localhost:${config.get('port')}  
`.trim();

  console.log(info); // eslint-disable-line no-console
  mongoConn.start(config.get('database'));
});

module.exports = app;
