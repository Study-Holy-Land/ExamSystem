'use strict';

var UserChannel = require('../models/user-channel.js');
var Channel = require('../models/channel.js');
var Configuration = require('../models/configuration');
var constant = require('../mixin/constant');

function AdminController() {

}

AdminController.prototype.addChannel = (req, res, next) => {
  var newChannel = new Channel();
  newChannel.name = req.body.name;

  Channel.findOne({name: newChannel.name}, (err, link) => {
    if (err) {
      return next(err);
    } else if (!link) {
      newChannel.save((err, newLink, numAffected) => {
        if (err) {
          return next(err);
        }
      });
      res.sendStatus(constant.httpCode.OK);
    } else if (link) {
      res.send({message: 'Already Exist'});
    }
  });
};

AdminController.prototype.getChannel = (req, res, next) => {
  Channel.find({}, (err, links) => {
    if (err) {
      return next(err);
    }
    res.send({links: links});
  });
};

AdminController.prototype.removeChannel = (req, res, next) => {
  var name = req.query.name;
  var _id = req.query._id;

  Channel.findOneAndRemove({name: name, _id: _id}, (err) => {
    if (err) {
      return next(err);
    }
    res.sendStatus(constant.httpCode.OK);
  });
};

AdminController.prototype.getRegisterableStatus = (req, res, next) => {
  Configuration.findOne({}, (err, configuration) => {
    if (err) {
      return next(err);
    }
    res.send({configuration: configuration});
  });
};

AdminController.prototype.changeRegisterableStatus = (req, res, next) => {
  var value = req.body.value;

  Configuration.findOne({}, (err, configuration) => {
    if (err) {
      return next(err);
    }
    configuration.registerable = value;
    configuration.save((err, configuration, numAffected) => {
      if (err) {
        return next(err);
      }
      res.send({configuration: configuration});
    });
  });
};

AdminController.prototype.getUsersChannel = (req, res, next) => {
  UserChannel.find()
    .populate('channelId')
    .exec((err, data) => {
      if (err) {
        return next(err);
      } else {
        var usersChannel = data.map((item) => {
          return {userId: item.userId, channelName: item.channelId.name};
        });
        res.send({
          usersChannel: usersChannel
        });
      }
    });
};

module.exports = AdminController;
