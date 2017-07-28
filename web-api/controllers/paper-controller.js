var apiRequest = require('../services/api-request');
var async = require('async');
var UserPaper = require('../models/user-paper');
var logicPuzzleQuiz = require('../services/logic-puzzle/quiz-service');
var httpStatus = require('../mixin/constant').httpCode;

function details(req, res, next) {
  var paperHash = req.params.paperHash;
  var userId = req.session.user.id;
  var paper = {};
  var doc;
  var paperIndex;
  var error = {};

  async.waterfall([
    (done) => {
      UserPaper.findOne({userId: userId}, done);
    },

    (data, done) => {
      if (!data) {
        done(true, null);
      } else {
        doc = data;
        paper = data.papers.find((paper, index) => {
          paperIndex = index;
          return paper._id.equals(paperHash);
        });
        done(null, paper);
      }
    },

    (data, done) => {
      if (data.hasOwnProperty('sections') && data.sections.length !== 0) {
        done(null, data);
      } else {
        apiRequest.get('papers/' + data.id, done);
      }
    },

    (data, done) => {
      if (paper.sections.length !== 0) {
        done(null, paper);
      } else {
        doc.papers[paperIndex].sections = data.body.sections;

        doc.save((err) => {
          if (err) {
            error.status = httpStatus.INTERNAL_SERVER_ERROR;
            done(error, null);
          } else {
            done(null, data);
          }
        });
      }
    },
    (data, done) => {
      done(null, null);
    }
  ], (err, data) => {
    if (err === true) {
      res.send({
        status: httpStatus.NOT_FOUND
      });
    } else if (err !== null && err.status === httpStatus.INTERNAL_SERVER_ERROR) {
      res.send({
        status: httpStatus.INTERNAL_SERVER_ERROR
      });
    } else {
      res.send({
        status: httpStatus.OK
      });
    }
  });
}

function obtain(req, res, next) {
  var params = {
    paperId: req.params.paperId,
    userId: req.session.user.id
  };

  async.waterfall([
    (done) => {
      logicPuzzleQuiz.getList(params, done);
      // 获取逻辑题状态
    }
  ], (err, data) => {
    if (err) {
      return next(err);
    }
    return res.sendStatus(200);
  });
}

function getLists(req, res, next) {
  apiRequest.get('paperLists', (err, data) => {
    if (err) {
      return next(err);
    }
    res.send(data);
  });
}

function modifyPaperMeta(req, res, next) {
  var paperMeta = {
    title: req.body.title,
    description: req.body.description,
    easyCount: req.body.easyCount,
    normalCount: req.body.normalCount,
    hardCount: req.body.hardCount
  };
  apiRequest.put('papers-meta', paperMeta, (err, data) => {
    if (err) {
      return next(err);
    }
    res.send(paperMeta);
  });
}

function createPaper(req, res, next) {
  var params = {
    simple: req.body.simple,
    general: req.body.general,
    complex: req.body.complex
  };
  apiRequest.post('papers', params, (err, data) => {
    if (err) {
      return next(err);
    }
    res.send(data);
  });
}

function deletePaper(req, res, next) {
  var id = req.params.id;
  apiRequest.get('paperLists', (err, data) => {
    if (err) {
      return next(err);
    }
    const lists = data.body.paperLists;
    const list = lists.find(list => list.id === id);
    lists.splice(lists.indexOf(list), 1);
    res.send(lists);
  });
}

module.exports = {
  details: details,
  obtain: obtain,
  getLists: getLists,
  modifyPaperMeta: modifyPaperMeta,
  createPaper: createPaper,
  deletePaper: deletePaper
};
