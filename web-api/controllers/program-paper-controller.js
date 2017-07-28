var constant = require('../mixin/constant');
// var apiRequest = require('../services/api-request');
var PaperService = require('../services/paper-service/index');
var PaperDefinition = require('../models/paper-definition');
const paperService = new PaperService();

class ProgramPaperController {
  submitPaper(req, res, next) {
    let sectionId = req.params.sectionId;
    let paperId = req.params.paperId;
    let userId = req.session.user.id;
    let quizzes = req.body;
    paperService.submitPaper({condition: {sectionId, paperId, userId}, quizzes}, (err) => {
      if (err) {
        return next(err);
      }
      return res.sendStatus(constant.httpCode.CREATED);
    });
  }

  getQuizList(req, res, next) {
    let sectionId = req.params.sectionId;
    paperService.getQuizList(sectionId, (err, docs) => {
      if (err) {
        return next(err);
      }
      return res.send(docs);
    });
  }

  getQuestionIds(req, res, next) {
    let sectionId = req.params.sectionId;
    paperService.getQuestionIds(sectionId, (err, ids) => {
      if (err) {
        return next(err);
      }

      return res.send(ids);
    });
  }

  getSection(req, res, next) {
    let programId = req.params.programId;
    let paperId = req.params.paperId;
    let userId = req.session.user.id;

    paperService.getSection({programId, _id: paperId, userId}, (err, data) => {
      if (err) {
        return next(err);
      }
      res.send({data});
    });
  }

  getPaperList(req, res, next) {
    let programId = req.params.programId;

    PaperDefinition.find({programId, isDistributed: true, isDeleted: false}, (err, docs) => {
      if (err) {
        return next(err);
      }
      let data = docs.map((doc) => {
        let array = doc.uri.split('/');
        return {
          createTime: doc.createTime,
          paperName: doc.paperName,
          description: doc.description,
          operationId: doc.makerId,
          operationType: 'DISTRIBUTION',
          id: array[array.length - 1],
          uri: array[array.length - 2] + '/' + array[array.length - 1],
          operatorId: array[array.length - 1],
          programId: doc.programId,
          makerId: array[array.length - 1]
        };
      });
      return res.send({data});
    });

    // apiRequest.get(`programs/${programId}/papers`, (err, resp) => {
    //   if (err) {
    //     return next(err);
    //   }
    //   let data = resp.body.paperList.filter(paper => {
    //     return paper.operationType !== 'DELETE' || paper.operationType !== 'UNDISTRIBUTION';
    //   });
    //   console.log(JSON.stringify(data, null, 2));
    //   return res.send({data});
    // });
  };

  retrievePaper(req, res, next) {
    let programId = req.params.programId;
    let paperId = req.params.paperId;
    let userId = req.session.user.id;
    paperService.retrieve({programId, paperId, userId}, (err, data) => {
      if (err) {
        return next(err);
      }
      res.send({data});
    });
  };
}

module.exports = ProgramPaperController;
