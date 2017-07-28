var async = require('async');
var apiRequest = require('../api-request');
var Message = require('../../models/messages');

class FindMessagesService {

  findMessage({id, state, currentPageParam, pageCountParam}, callback) {
    let pageCount = pageCountParam || 10;
    let currentPage = currentPageParam || 1;
    let totalPage = 0;
    let condition = {to: id};
    if (state === 0) {
      condition = Object.assign(condition, {state: state});
    }
    async.waterfall([
      (done) => {
        Message.count(condition, done);
      },
      (data, done) => {
        totalPage = Math.ceil(data / pageCount);
        Message.find(condition)
          .sort({state: 1, updatedAt: -1})
          .limit(Number(pageCount))
          .skip(pageCount * (currentPage - 1))
          .exec(done);
      },
      (data, done) => {
        if (data.length === 0) {
          return done(null, data);
        }
        const fromIds = data.map((item) => {
          return item.from;
        });
        const userIds = this.removeDuplicate(fromIds);
        apiRequest.get(`users/${userIds.toString()}/detail`, (err, resp) => {
          if (err) {
            return done(err, null);
          }
          const userList = resp.body.userList ? resp.body.userList : [].concat(resp.body);
          const items = [];
          data.forEach((message) => {
            userList.forEach((item) => {
              const existence = (item.id === message.from);
              if (existence) {
                items.push(Object.assign({},
                  {
                    _id: message._id,
                    to: message.to,
                    type: message.type,
                    updatedAt: message.updatedAt,
                    deeplink: message.deeplink,
                    state: message.state
                  },
                  {fromDetail: item}
                ));
              }
            });
          });
          done(null, items);
        });
      }
    ], (err, data) => {
      if (err) {
        callback(err, null);
      } else {
        let messageInfo = {message: data, totalPage: totalPage};
        callback(null, messageInfo);
      }
    });
  }

  removeDuplicate(arr) {
    let result = [];
    arr.forEach((item) => {
      let existence = result.find(id => id === item);
      if (!existence) {
        result.push(item);
      }
    });
    return result;
  }
}

module.exports = FindMessagesService;
