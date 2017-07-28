var PaperDraft = require('../models/paper-draft');
var async = require('async');
var httpStatus = require('../mixin/constant').httpCode;

function PaperDraftController() {

}

PaperDraftController.prototype.getPaperDraft = (req, res, next) => {
  async.waterfall([(done) => {
    PaperDraft.find(done);
  }, (data, done) => {
    if (!data) {
      var error = httpStatus.NOT_FOUND;
      done(error, null);
    } else {
      done(null, data);
    }
  }], (err, data) => {
    if (data) {
      res.send(data);
    } else if (err === httpStatus.NOT_FOUND) {
      res.send({
        status: httpStatus.NOT_FOUND,
        paperDrafts: null
      });
    } else {
      next(err);
    }
  });
};

PaperDraftController.prototype.createPaperDraft = (req, res, next) => {
  var paperDraftDemo = new PaperDraft(req.body);

  paperDraftDemo.save((err) => {
    if (err) return next(err);
    res.send({paperHash: paperDraftDemo._id});
  });
};

PaperDraftController.prototype.insertLogicPuzzleSections = (req, res, next) => {
  var paperHash = req.params.paperHash;
  var doc;
  var error = {};

  async.waterfall([
    (done) => {
      PaperDraft.findOne({_id: paperHash}, done);
    }, (data, done) => {
      if (!data) {
        error.status = httpStatus.NOT_FOUND;
        done(error, null);
      } else {
        doc = data;
        doc.logicPuzzleSections.push(req.body);
        doc.save((err) => {
          if (err) {
            done(true, null);
          } else {
            done(null, null);
          }
        });
        done(null, data);
      }
    }], (err, data) => {
    if (data) {
      res.send({
        status: httpStatus.OK
      });
    } else if (err === httpStatus.NOT_FOUND) {
      res.send({
        status: httpStatus.NOT_FOUND
      });
    } else {
      next(err);
    }
  });
};

PaperDraftController.prototype.insertHomeworkSections = (req, res, next) => {
  var paperHash = req.params.paperHash;
  var error = {};
  var doc;

  async.waterfall([(done) => {
    PaperDraft.findOne({_id: paperHash}, done);
  }, (data, done) => {
    if (!data) {
      error.status = httpStatus.NOT_FOUND;
      done(error, null);
    } else {
      doc = data;
      done(null, data);
    }
  }, (data, done) => {
    var homeworkSectionsLength = data.homeworkSections.length;
    doc.homeworkSections[homeworkSectionsLength - 1].items.push(req.body);
    doc.save((err) => {
      if (err) {
        done(true, null);
      } else {
        done(null, null);
      }
    });
    done(null, data);
  }], (err, data) => {
    if (data) {
      res.send({
        status: httpStatus.OK
      });
    } else if (err.status === httpStatus.NOT_FOUND) {
      res.send({
        status: httpStatus.NOT_FOUND
      });
    } else {
      next(err);
    }
  });
};
module.exports = PaperDraftController;
