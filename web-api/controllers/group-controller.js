'use strict';
var userApiRequest = require('../services/user-api-request');
var apiRequest = require('../services/api-request');
var async = require('async');
var constant = require('../mixin/constant');
var Group = require('../models/group');

function GroupController() {

}

GroupController.prototype.getGroupInfo = (req, res, next) => {
  var groupHash = req.params.groupHash;
  var groupId;

  async.waterfall([
    (done) => {
      Group.findOne({_id: groupHash}, done);
    }, (data, done) => {
      groupId = data.groupId;
      userApiRequest.get('groups/' + groupId, done);
    }], (err, data) => {
    if (err) {
      return next(err);
    } else {
      res.send(data.body);
    }
  });
};

function getGroupHashByGroupId(groupList, groupId) {
  var group = groupList.find((item) => {
    return item.groupId === groupId;
  });
  if (group) return group._id;
}

GroupController.prototype.loadGroup = (req, res, next) => {
  var userId = req.session.user.id;
  var role = req.session.user.role;
  var groupUrl = 'users/' + userId + '/groups';
  var newGroupList;
  async.waterfall([
    (done) => {
      userApiRequest.get(groupUrl, done);
    }, (resp, done) => {
      if (resp.status === constant.httpCode.OK) {
        var groupList;
        Group.find({}, (err, data) => {
          if (data) {
            groupList = data;
            newGroupList = resp.body.map((item) => {
              var groupId = item.id;
              var groupHash = getGroupHashByGroupId(groupList, groupId);
              return Object.assign({}, item, {groupHash: groupHash});
            });
            done(null, resp);
          } else {
            done(err, null);
          }
        });
      } else {
        done(null, resp);
      }
    }
  ], (err, data) => {
    if (err) next(err);
    if (data.status === constant.httpCode.OK) {
      res.send({
        status: constant.httpCode.OK,
        groups: newGroupList,
        role: role
      });
    }
  });
};

GroupController.prototype.createGroup = (req, res, next) => {
  // todo : 看样子应该是未完善的功能，这里没有调用 paper-api 将数据持久化到 mysql
  var demo = new Group({groupId: null});

  demo.save((err) => {
    if (err) return next(err);
    res.send({groupHash: demo._id});
  });
};

GroupController.prototype.updateGroupInfo = (req, res, next) => {
  var groupHash = req.params.groupHash;
  var data;
  var groupInfo = {
    name: req.body.name,
    avatar: req.body.avatar,
    adminId: req.session.user.id,
    announcement: req.body.announcement,
    isAnnouncePublished: req.body.isAnnouncePublished
  };
  async.waterfall([
    (done) => {
      Group.findOne({_id: groupHash}, done);
    },
    (result, done) => {
      data = result;
      if (data.groupId !== null) {
        var url = 'groups/' + data.groupId;
        apiRequest.put(url, req.body, done);
      } else {
        apiRequest.post('groups', groupInfo, (err, resp) => {
          if (resp) {
            data.groupId = resp.body.uri.split('/')[2];
            data.save();
            done(null, resp);
          } else {
            done(err, null);
          }
        });
      }
    }
  ], (err, data) => {
    if (err) {
      return next(err);
    }
    res.send({status: data.status});
  });
};

GroupController.prototype.operatePaper = (req, res, next) => {
  var paperInfo = {
    paperName: req.body.paperName,
    makerId: req.session.user.id
  };

  apiRequest.post('papers', paperInfo, (err, resp) => {
    if (resp === undefined) {
      res.send({
        status: constant.httpCode.INTERNAL_SERVER_ERROR
      });
    } else if (resp.status === constant.httpCode.OK) {
      res.send({
        status: constant.httpCode.CREATED,
        paperId: resp.body.paperId
      });
    } else if (resp.status === constant.httpCode.NOT_FOUND) {
      res.send({
        status: constant.httpCode.NOT_FOUND
      });
    } else {
      return next(err);
    }
  });
};

GroupController.prototype.loadSection = (req, res, next) => {
  var paperId = req.params.id;
  var url = 'papers/' + paperId;

  async.waterfall([(done) => {
    apiRequest.get(url, done);
  },
    (data, done) => {
      if (!data) {
        done(true, null);
      } else {
        done(null, data);
      }
    }], (err, data) => {
    if (err) {
      res.send({
        status: constant.httpCode.NOT_FOUND
      });
    } else if (data.status === constant.httpCode.OK) {
      res.send({
        sections: data.body.sections,
        status: data.status
      });
    } else {
      return next(err);
    }
  });
};

module.exports = GroupController;
