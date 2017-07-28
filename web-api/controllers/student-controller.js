const async = require('async');
const Message = require('../models/messages');
const apiRequest = require('../services/api-request');
const constant = require('../mixin/constant');

function StudentController() {
}

StudentController.prototype.getMentees = (req, res, next) => {
  let {page, pageCount} = req.query;
  let totalPage;
  let students = [];
  let studentIds = [];
  const mentorId = req.session.user.id;
  async.waterfall([
    (done) => {
      apiRequest.get(`users/${mentorId}/mentees`, {page, pageSize: pageCount}, (err, resp) => {
        done(err, resp.body);
      });
    },
    (docs, done) => {
      studentIds = docs.studentIds;
      totalPage = Math.ceil(docs.totalCount / pageCount);
      async.map(studentIds, (studentId, callback) => {
        apiRequest.get(`users/${studentId}/detail`, callback);
      }, (err, result) => {
        if (result) {
          result.forEach(({body}) => {
            students.push(body);
          });
        }
        done(err, students);
      });
    },
    (data, done) => {
      async.map(studentIds, (studentId, callback) => {
        apiRequest.get(`users/${studentId}/homeworkSubmitCount`, callback);
      }, (err, result) => {
        if (result) {
          result.forEach(({body}, index) => {
            students[index].homeworkSubmitCount = body.homeworkSubmitCount;
          });
        }
        done(err, students);
      });
    },
    (students, done) => {
      students = students.map(({id, name, school, email, homeworkSubmitCount}) => {
        return {id, name, school, email, homeworkSubmitCount};
      });
      async.map(students, ({id}, callback) => {
        Message.findOne({from: id, to: mentorId, type: 'REQUEST_ANSWER'}, callback);
      }, (err, result) => {
        done(err, result);
      });
    },
    (result, done) => {
      students = students.map((student, index) => {
        return Object.assign({}, student, {hasRequestAnswer: result[index]});
      });
      done(null, students);
    }
  ], (err, students) => {
    if (err) {
      return next(err);
    }
    res.status(constant.httpCode.OK).send({students, totalPage});
  });
};

module.exports = StudentController;
