/*eslint no-magic-numbers: 0*/
'use strict';

var Reflux = require('reflux');
var superAgent = require('superagent');
var errorHandler = require('../../../../tools/error-handler.jsx');

var submissionIntroductionStore = Reflux.createStore({

  onGetBranches: function (url) {
    this.trigger({showIcon: true});
    if (url.indexOf('https://') === -1) {
      url = 'https://' + url;
    }
    superAgent.get(API_PREFIX + 'homework/get-branches')
      .set('Content-Type', 'application/json')
      .query({url: url})
      .use(errorHandler)
      .end((err, res) => {
        if (err) {
          return;
        }
        if (res.body.message === 'Not Found') {
          this.trigger({githubUrlError: '仓库不存在', branches: [], showIcon: false});
        } else {
          var branches = res.body.data.map((branch) => {
            return branch.name;
          });
          if (branches.indexOf('master') !== -1) {
            var index = branches.indexOf('master');
            branches.splice(index, 1);
            branches.unshift('master');
          }
          this.trigger({
            branches: branches,
            defaultBranch: branches[0],
            showIcon: false,
            branchesDetail: res.body.data
          });
        }
      });
  }
});

module.exports = submissionIntroductionStore;
