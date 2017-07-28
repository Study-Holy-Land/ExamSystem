'use strict';

require('./libs/outdatedBrowserCheck');
require('../less/weChat-loading.less');
require('../images/clock-loading.gif');
var superagent = require('superagent');
var getQueryString = require('../../tools/getQueryString');
var page = require('page');
var errorHandler = require('../../tools/error-handler.jsx');

var WeChatLoading = React.createClass({
  componentDidMount: function () {
    var code = getQueryString('code');
    superagent.post(API_PREFIX+'weChat-login')
        .send({code})
        .use(errorHandler)
        .end((err, res) => {
          if (err && res.statusCode === 404) {
            var thirdPartyUserId = res.body.thirdPartyUserId;
            page(`thridParty-userDetail.html?thirdPartyUserId=${thirdPartyUserId}`);
          }
          if (err) {
            throw err;
          }
          page('paper-list.html');
        })
  },

  render: function () {
    return (
        <div className="loading">
          <img src="build/clock-loading.gif" alt="Loader" className="loading-img"/>
        </div>
    )
  }
});

ReactDOM.render(<WeChatLoading />, document.getElementById('weChat-loading'));
