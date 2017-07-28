var shelljs = require('shelljs');
var colors = require('colors');


function isMockServerStarted() {
  return shelljs.exec('lsof -t -i:12306', {silent: true}).code === 0;
}

function startMockServer() {
  shelljs.exec('java -jar spec/support/moco-runner-0.10.2-standalone.jar http -p 12306 -g spec/support/paper-api.json -s 9527 ', {
    async: true,
    silent: true
  });
}

function waitForStarted(done) {
  for (let i = 0; !isMockServerStarted(); ++i) {
    if (i > 10) {
      done(new Error('Unable to start Mock Server'));
    }
    else {
      console.log('Waiting for Mock Server to launch...'.underline.yellow);
    }
  }
}


function startServer(config, done) {
  startMockServer();
  waitForStarted(done);
  done();
}

function stopServer(done) {
  done();
}

module.exports = {
  start: startServer,
  stop: stopServer
};
