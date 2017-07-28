const async = require('async');
const moment = require('moment');
const mongoose = require('mongoose');
const Message = require('../../models/messages');
const Paper = require('../../models/paper');
const UserInfos = require('../../models/user-info');
const HomeworkScoring = require('../../models/homework-scoring');
const apiRequest = require('../api-request');
const {blankQuizFunc, blankQuizHandler, homeworkQuizFunc, homeworkQuizHandler, basicQuizFunc, basicQuizHandler, calcHomeworkElapsedTime, isHomeworkExist, infoContentHandler} = require('./quiz-handler');
const config = require('config');
const DOMAIN = config.get('domain');
const PATH_PREFIX = config.get('path_prefix');

const sectionClass = {
  blankQuizzes: {
    name: '逻辑题',
    percentage: '逻辑题正确率',
    asyncFunc: blankQuizFunc,
    contentHandler: blankQuizHandler
  },
  homeworkQuizzes: {
    name: '编程题',
    percentage: '编程题完成率',
    asyncFunc: homeworkQuizFunc,
    contentHandler: homeworkQuizHandler
  },
  basicQuizzes: {
    name: '简单客观题',
    percentage: '简单客观题正确率',
    asyncFunc: basicQuizFunc,
    contentHandler: basicQuizHandler
  }
};

class ExportCsvService {

  exportPaperCSV(data, callback) {
    const {programId} = JSON.parse(data);
    let content = '试卷名称,描述,创建时间,考试人数,试卷用户信息链接\n';
    const filename = 'program-' + programId + '-papers' + '.csv';
    async.waterfall([
      (done) => {
        apiRequest.get(`programs/${programId}/papers`, done);
      },
      (resp, done) => {
        if (!resp.body) {
          return done(null, null);
        }
        const program = resp.body;
        const paperList = program.paperList;
        async.map(paperList, (paper, callback) => {
          apiRequest.get(`papers/${paper.id}/userCount`, callback);
        }, (err, result) => {
          if (err) {
            return done(err);
          }
          result.forEach(({body}, index) => {
            paperList[index].userCount = body.userCount || 0;
          });
          done(null, paperList);
        });
      },
      (papers, done) => {
        if (!papers) {
          return done(null, {content, filename});
        }
        papers = papers.map((paper) => {
          const link = {programId, id: paper.id};
          const href = paper.userCount ? `${DOMAIN}${PATH_PREFIX}api/reports/2?data=${encodeURIComponent(JSON.stringify(link))}` : '';
          return Object.assign({}, paper, {link: href});
        });

        papers.forEach(({paperName, description, createTime, userCount, link}) => {
          content += paperName + ',';
          content += description + ',';
          content += moment.unix(createTime).format('YYYY-MM-DD HH:mm:ss') + ',';
          content += userCount + ',';
          content += link + '\n';
        });
        done(null, {content, filename});
      }
    ], callback);
  }

  exportUserCSV(data, callback) {
    const paperId = JSON.parse(data).id;
    const filename = 'paper-' + paperId + '-users.csv';
    let content = '名字,邮箱,手机号码,学校,专业,学历,入学年份,信息渠道,';
    let userData;
    let userSection;
    let sections = [];

    async.waterfall([
      (done) => {
        apiRequest.get(`papers/${paperId}`, done);
      },
      (response, done) => {
        if (!response) {
          return done(null, null);
        }
        response.body.sections.forEach(({id, quizzes, sectionType}, index) => {
          sections.push({sectionId: id, quizzes, sectionType, number: index + 1});
        });
        sections.forEach(({sectionType, number}) => {
          content += `第${number}个section:${sectionClass[sectionType].percentage},`;
          content += `第${number}个section:` + sectionClass[sectionType].name + '开始时间,';
          content += `第${number}个section:` + sectionClass[sectionType].name + '花费时间,';
        });
        content += '答题详情链接\n';
        done(null, content);
      },
      (content, done) => {
        apiRequest.get(`papers/${paperId}/usersDetail`, done);
      },
      (response, done) => {
        if (!response) {
          return done(null, null);
        }
        userData = response.body;
        userSection = response.body.map(({userId}) => {
          return Object.assign({}, {userId}, {sections});
        });
        done(null, userSection);
      },
      (userSection, done) => {
        let newUserSection = [];
        userData.forEach(({userId}) => {
          sections.forEach(({sectionId, sectionType}) => {
            newUserSection.push({userId, sectionId, sectionType});
          });
        });
        async.map(newUserSection, ({userId, sectionId, sectionType}, callback) => {
          sectionClass[sectionType].asyncFunc({userId, sectionId, paperId}, callback);
        }, (err, result) => {
          if (err) {
            return done(null, err);
          }
          done(null, result);
        });
      },
      (data, done) => {
        userData = userData.map((user) => {
          let sectionNumber = {};
          sections.forEach(({number}) => {
            sectionNumber['section' + number] = '';
          });
          let i = 1;
          data.forEach(({body}) => {
            if (body.length && body[0].userId === user.userId) {
              sectionNumber['section' + i] = Object.assign({}, body[0], {type: 'blankQuizzes'});
              ++i;
            }
            if (!body.length && body.items && body.items.find(({examerId}) => examerId === user.userId)) {
              sectionNumber['section' + i] = Object.assign({}, body, {type: 'homeworkQuizzes'});
              ++i;
            }
            if (!body.length) {
              sectionNumber['section' + i] = Object.assign({}, body, {type: 'basicQuizzes'});
            }
          });
          return Object.assign({}, user, {sectionNumber});
        });
        done(null, userData);
      },
      (data, done) => {
        async.map(data, (user, callback) => {
          UserInfos.findOne({userId: user.userId}, (err, doc) => {
            if (err) {
              return callback(err, null);
            }
            const channel = doc ? doc.channel : 'N/A';
            callback(null, Object.assign(user, {channel}));
          });
        }, (err, result) => {
          if (err) {
            return done(err, null);
          }
          userData = result;
          done(null, userData);
        });
      },
      (data, done) => {
        if (!userData) {
          return done(null, {content, filename});
        }
        userData = userData.map((user) => {
          const link = {paperId, userId: user.userId};
          const homeworkExist = isHomeworkExist(sections);
          const href = homeworkExist ? `${DOMAIN}${PATH_PREFIX}api/reports/3?data=${encodeURIComponent(JSON.stringify(link))}` : '';

          return Object.assign({}, user, {link: href});
        });

        userData.forEach(({name, email, mobilePhone, school, major, degree, entranceYear, channel, sectionNumber, link}) => {
          content += (name || 'N/A') + ',';
          content += email + ',';
          content += mobilePhone + ',';
          content = infoContentHandler(school, major, degree, entranceYear, content);

          if (channel === 'N/A') {
            content += 'N/A ,';
          } else {
            content += channel.join('、') + ',';
          }
          for (let i = 1; i <= Object.keys(sectionNumber).length; ++i) {
            if (sectionNumber['section' + i] === '') {
              content += 'N/A,N/A,N/A,';
            } else {
              content = sectionClass[sectionNumber['section' + i].type].contentHandler(sectionNumber, content, sections, i);
            }
          }
          content += link + '\n';
        });
        done(null, {content, filename});
      }
    ], callback);
  }

  exportQuizCSV(data, callback) {
    const {paperId, userId} = JSON.parse(data);
    const filename = 'user-' + userId + '-quizzes.csv';
    let content = '题目id,答题时间,提交地址\n';
    async.waterfall([
      (done) => {
        apiRequest.get(`papers/${paperId}/users/${userId}/homeworkHistory`, done);
      },
      (response, done) => {
        if (!response) {
          return done(null, {content, filename});
        }
        const correctHomeworkSubmit = response.body.items.filter(({status}) => {
          return status === 4;
        });
        correctHomeworkSubmit.forEach(({homeworkQuizId, startTime, commitTime, userAnswerRepo, version}) => {
          content += homeworkQuizId + ',';
          content += calcHomeworkElapsedTime(commitTime - startTime) + ',';
          content += userAnswerRepo + '/commit/' + version + '\n';
        });
        done(null, {content, filename});
      }
    ], callback);
  }

  exportMenteeQuizCSV(data, callback) {
    const {mentorId, menteeId} = data;
    let content = '题目id,答题时间,提交地址\n';
    const filename = `mentee-${menteeId}-homework.csv`;
    let homeworkId;
    async.waterfall([
      (done) => {
        Message.find({from: menteeId, to: mentorId, type: 'REQUEST_ANSWER'})
          .limit(1)
          .sort({updatedAt: -1})
          .exec((err, message) => {
            done(err, message);
          });
      },
      (message, done) => {
        let id = mongoose.Types.ObjectId(message[0].deeplink);
        Paper.aggregate()
          .unwind('$sections')
          .unwind('$sections.quizzes')
          .match({'sections.quizzes._id': id})
          .exec(done);
      },
      (paper, done) => {
        Paper.populate(paper, ['sections.quizzes.submits', 'sections.quizzes.quizId'], done);
      },
      (doc, done) => {
        homeworkId = doc[0].sections.quizzes.quizId.id;
        const submits = doc[0].sections.quizzes.submits;
        async.map(submits, ({homeworkScoringId}, callback) => {
          HomeworkScoring.findById(homeworkScoringId, callback);
        }, (err, result) => {
          done(err, result);
        });
      },
      (submits, done) => {
        if (!submits) {
          return done(null, {content, filename});
        }
        submits.forEach(({startTime, commitTime, userAnswerRepo, version}) => {
          content += homeworkId + ',';
          content += calcHomeworkElapsedTime(commitTime - startTime) + ',';
          content += githubUrlHandler(userAnswerRepo) + `/commit/${version}\n`;
        });
        done(null, {content, filename});
      }
    ], callback);
  }

}

function githubUrlHandler(userAnswerRepo) {
  if (userAnswerRepo.includes('.git')) {
    return userAnswerRepo.split('.git')[0];
  } else {
    return userAnswerRepo;
  }
}

module.exports = ExportCsvService;
