const Program = require('../../models/program');
const InvitationCode = require('../../models/invitation-code');
const async = require('async');
const apiRequest = require('../api-request');
const constant = require('../../mixin/constant');

class ProgramService {

  checkOrderEnable(programType) {
    if (programType === 'exam') {
      return true;
    } else {
      return false;
    }
  }

  create(req, callback) {
    const orderEnable = this.checkOrderEnable(req.body.programType);
    let programCode = this.invitationCode(8);
    let programInfo = Object.assign({}, req.body, {orderEnable}, {programCode});
    let makerId = req.session.user.id;
    async.waterfall([
      (done) => {
        apiRequest.post('programs', programInfo, done);
      },
      (resp, done) => {
        Object.assign(programInfo, {programId: resp.body.id, makerId});
        Program.create(programInfo, done);
      }
    ], (err, doc) => {
      callback(err, doc);
    });
  }

  update({_id, programInfo}, callback) {
    async.waterfall([
      (done) => {
        Program.findByIdAndUpdate(_id, programInfo, done);
      },
      (docs, done) => {
        if (!docs) {
          return done({status: 404}, null);
        }
        apiRequest.put(`programs/${docs.programId}`, programInfo, done);
      }
    ], (err) => {
      callback(err);
    });
  }

  getList({makerId, currentPage, pageCount}, callback) {
    let totalPage = 0;
    async.waterfall([
      (done) => {
        Program.count(done);
      },
      (data, done) => {
        totalPage = Math.ceil(data / pageCount);
        Program.find()
          .limit(Number(pageCount))
          .skip(pageCount * (currentPage - 1))
          .exec(done);
      },
      (docs, done) => {
        async.map(docs, (doc, cb) => {
          apiRequest.get(`programs/${doc.programId}/users`, (err, response) => {
            let item = doc.toJSON();
            if (response.statusCode === 404) {
              item.peopleNumber = 0;
              return cb(null, item);
            }
            if (err) {
              return done(err, null);
            }

            item.peopleNumber = response.body.usersUri.length;
            return cb(null, item);
          });
        }, (err, result) => {
          done(err, result);
        });
      }
    ], (err, result) => {
      callback(err, {totalPage, programList: result});
    });
  }

  addProgramByProgramCode(req, callback) {
    let programCode = req.body.programCode;
    let userId = req.session.user.id;
    async.waterfall([
      (done) => {
        Program.findOne({programCode}, done);
      },
      (doc, done) => {
        if (doc && doc.codeEnable) {
          return done(null, doc.programId);
        }
        return done({status: constant.httpCode.NOT_FOUND}, null);
      },
      (programId, done) => {
        apiRequest.post(`users/${userId}/programs/${programId}`, {}, (err, resp) => {
          if (resp.statusCode === constant.httpCode.DUPLICATE_CONTENT) {
            done({status: resp.statusCode}, null);
          }
          return done(err, resp);
        });
      }
    ], (err) => {
      if (err) {
        return callback(err, null);
      }
      return callback(err, null);
    });
  }

  addProgramByInvitationCode(req, callback) {
    let invitationCode = req.body.invitationCode;
    let userId = req.session.user.id;
    async.waterfall([
      (done) => {
        InvitationCode.findOne({invitationCode}, done);
      },
      (doc, done) => {
        if (!doc) {
          return done({status: constant.httpCode.NOT_FOUND}, null);
        }
        if (doc.status === 1) {
          return done({status: constant.httpCode.BAD_REQUEST}, null);
        }
        apiRequest.post(`users/${userId}/programs/${doc.programId}`, {}, (err, resp) => {
          if (resp.statusCode === constant.httpCode.DUPLICATE_CONTENT) {
            return done({status: resp.statusCode}, null);
          }
          return done(err, resp);
        });
      },
      (doc, done) => {
        InvitationCode.findOneAndUpdate({invitationCode}, {$set: {status: 1}}, done);
      }], callback);
  }

  getInvitationCode(req, callback) {
    const programId = req.params.programId;
    const status = req.query.status;
    let page = req.query.page || 1;
    if (req.query.page <= 0) {
      page = 1;
    }
    const pageCount = req.query.pageCount || 10;
    const skipCount = pageCount * (page - 1);
    let query = status === '2' ? {programId} : {programId, status};

    async.series({
      items: (done) => {
        InvitationCode.find(query, done).limit(Number(pageCount)).skip(skipCount);
      },
      totalPage: (done) => {
        InvitationCode.count(query, (err, data) => {
          let totalPage = Math.ceil(data / pageCount);
          done(err, totalPage);
        });
      }
    }, (err, data) => {
      callback(err, data);
    });
  }

  getInvitationCodeCount(req, callback) {
    const programId = req.params.programId;
    const status = [0, 1];

    async.map(status, (item, callback) => {
      InvitationCode.count({programId: programId, status: item}, (err, doc) => {
        callback(err, doc);
      });
    }, (err, result) => {
      callback(err, result);
    });
  }

  addInvitationCode(req, callback) {
    const programId = req.params.programId;
    const CodeList = new Array(11).join(0).split('');

    const invitationCodeList = CodeList.map(item => {
      return {
        programId: programId,
        invitationCode: this.invitationCode(12),
        status: 0
      };
    });

    async.map(invitationCodeList, (invitationCode, callback) => {
      InvitationCode.create(invitationCode, (err, doc) => {
        callback(err, doc);
      });
    }, (err, result) => {
      callback(err, result);
    });
  }

  invitationCode(n) {
    const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    var code = '';
    for (var i = 0; i < n; i++) {
      var index = Math.ceil(Math.random() * 35);
      code += chars[index];
    }
    return code;
  }
}

module.exports = ProgramService;
