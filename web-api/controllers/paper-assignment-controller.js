'use strict';
var PaperAssignment = require('../models/paper-assignment');
var constant = require('../mixin/constant');
var apiRequest = require('../services/api-request');

function PaperAssignmentController() {
}

PaperAssignmentController.prototype.getLinks = (req, res, next) => {
  PaperAssignment.find({}, (err, links) => {
    if (err) {
      return next(err);
    }
    res.send({links: links});
  });
};

PaperAssignmentController.prototype.addLink = (req, res, next) => {
  var newLink = new PaperAssignment();
  newLink.phoneNumber = req.body.phoneNumber;
  newLink.paperName = req.body.paperName;
  newLink.paperId = req.body.paperId;

  PaperAssignment.findOne({
    phoneNumber: newLink.phoneNumber,
    paperName: newLink.paperName,
    paperId: newLink.paperId
  }, (err, link) => {
    if (err) {
      return next(err);
    } else if (!link) {
      newLink.save((err, newLink, numAffected) => {
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

PaperAssignmentController.prototype.removeLink = (req, res, next) => {
  var phoneNumber = req.query.phoneNumber;
  var paperName = req.query.paperName;

  PaperAssignment.findOneAndRemove({phoneNumber: phoneNumber, paperName: paperName}, (err) => {
    if (err) {
      return next(err);
    }
    res.sendStatus(constant.httpCode.OK);
  });
};

PaperAssignmentController.prototype.getPaperName = (req, res, next) => {
  apiRequest.get('papers', (err, data) => {
    if (err) {
      return next(err);
    }
    res.send({papers: data.body});
  });
};

module.exports = PaperAssignmentController;
