'use strict';

var Reflux = require('reflux');
var UserCenterActions = require('../../actions/user-center/user-center-actions');
var request = require('superagent');
var page = require('page');
var constant = require('../../../../mixin/constant');
var errorHandler = require('../../../../tools/error-handler.jsx');

var UserDetailStore = Reflux.createStore({
  listenables: [UserCenterActions],

  onPathChange: function (ctx, next) {
    this.trigger({currentState: ctx.hash});
  },

  onLoadUserDetail: function () {
    request.get(API_PREFIX + 'user-detail')
        .set('Content-Type', 'application/json')
        .use(errorHandler)
        .end((err, res) => {
          if (err) {
            return;
          } else if (res.body.status === constant.httpCode.ACCEPTED) {
            this.trigger({isThirdParty: true});
          } else if (res.body.status === constant.httpCode.OK) {
            this.addChannelsInfo(res.body.data);
            this.trigger(res.body.data);
          } else {
            return;
          }
        });
  },

  addChannelsInfo: function (data) {
    const channelTags = [
      '高校就业网',
      '学校BBS论坛',
      '学校官方微信',
      '实习僧',
      '牛客网',
      '老师推荐',
      '同学告知',
      '社团推荐',
      '学校海报及传单',
      'ThoughtWorks官方平台'
    ];
    let channelsInfo = {otherChannel: ''};

    if (!data.channel) {
      channelsInfo.chooseChannels = channelTags.map(label => {
        return {isChecked: false, label};
      });
    } else {
      const otherChannels = data.channel.filter(item => !channelTags.includes(item));
      if (otherChannels.length) {
        channelsInfo.otherChannel = otherChannels[otherChannels.length - 1];
      }
      channelsInfo.chooseChannels = channelTags.map((label) => {
        const isChecked = !!data.channel.find(item => item === label);
        return {isChecked, label};
      });
    }
    this.trigger({channelsInfo});
  },

  onLoadResult: function () {
    request.get(API_PREFIX + 'user/feedback-result')
        .set('Content-Type', 'application/json')
        .use(errorHandler)
        .end((err, res) => {
          if (err) {
            throw err;
          } else if (res.body.httpCode === constant.httpCode.NOT_FOUND) {
            this.trigger({
              logicPuzzle: '',
              homework: []
            });
          } else {
            this.trigger({
              logicPuzzle: res.body.logicPuzzle,
              homework: res.body.homework
            });
          }
        });
  },

  onUpdateUserDetail: function (userData) {
    request.put(API_PREFIX + 'user-detail/update')
        .set('Content-Type', 'application/json')
        .send({
          data: userData
        })
        .use(errorHandler)
        .end((err, req) => {
          if (err) {
            throw err;
          }
          if (req.body.status === constant.httpCode.OK) {
            page('paper-list.html');
          }
        });
  },

  onChangeState: function (state, currentState) {
    if (state !== currentState) {
      this.trigger({
        currentState: state
      });
    }
  },

  onChangeGender: function (name) {
    this.trigger({gender: name});
  },

  onValidateGender: function (genderError) {
    if (genderError === true) {
      this.trigger({genderError: false});
    }
  },

  onCheckGender: function (gender) {
    if (gender === '') {
      this.trigger({genderError: true});
    } else {
      this.trigger({genderError: false});
    }
  },

  onChangeChannelsInfo: function (channelsInfo) {
    this.trigger({channelsInfo});
  }
});
module.exports = UserDetailStore;
