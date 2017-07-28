'use strict';

var express = require('express');
var router = express.Router();
var constant = require('../../mixin/constant');
var _timeBase = 90;
var Paper = require('../../models/paper');
var async = require('async');
router.get('/remain-time', (req, res) => {
  var TOTAL_TIME = _timeBase * constant.time.SECONDS_PER_MINUTE;
  var userId = req.session.user ? req.session.user.id : 'invalid';
  var sectionId = req.query.sectionId;
  var startTime;
  var thisSection;

  async.waterfall([
    (done) => {
      if (userId === 'invalid') {
        done(true);
      } else {
        Paper.findOne({'sections._id': sectionId}).exec((err, doc) => {
          if (err) {
            return done(err, null);
          }
          startTime = parseInt(new Date().getTime() / constant.time.MILLISECOND_PER_SECONDS);
          thisSection = doc.sections.find(section => section._id + '' === sectionId);
          if (thisSection.startTime) {
            startTime = thisSection.startTime;
            done(null, doc);
          } else {
            var sectionIndex = doc.sections.indexOf(thisSection);
            doc.sections[sectionIndex].startTime = startTime;
            doc.save((err, doc) => {
              if (err) {
                done(err, null);
              }
              done(null, doc);
            });
          }
        });
      }
    },
    (doc, done) => {
      var now = parseInt(new Date().getTime()) / constant.time.MILLISECOND_PER_SECONDS;
      var usedTime = now - startTime;
      done(null, parseInt((TOTAL_TIME - usedTime)));
    }
  ], (err, remainTime) => {
    if (err) {
      res.sendStatus(constant.httpCode.INTERNAL_SERVER_ERROR);
    } else {
      res.send({
        remainTime: remainTime
      });
    }
  });
});

router.get('/initSection/:sectionId', (req, res, next) => {
  var sectionId = req.params.sectionId;
  var startTime;
  var thisSection;
  Paper.findOne({'sections._id': sectionId}, (err, doc) => {
    if (err || !doc) {
      return next(err);
    }
    startTime = parseInt(new Date(2017, 4, 2).getTime() / constant.time.MILLISECOND_PER_SECONDS);
    thisSection = doc.sections.find(section => section._id + '' === sectionId);
    if (thisSection.startTime) {
      return res.send({startTime: thisSection.startTime}).status(200);
    } else {
      var sectionIndex = doc.sections.indexOf(thisSection);
      doc.sections[sectionIndex].startTime = startTime;
      doc.save((err) => {
        if (err) {
          return next(err);
        }
        return res.send({startTime: startTime}).status(201);
      });
    }
  });
});

module.exports = router;
