var async = require('async');
var Message = require('../../models/messages');
var apiRequest = require('../api-request');

class MentorService {
  findAllMentors({to}, callback) {
    let mentors = [];
    async.waterfall([
      (done) => {
        apiRequest.get(`users/${to}/mentors`, (err, res) => {
          done(err, res.body.mentorIds);
        });
      },
      (data, done) => {
        if (!data.length) {
          return done(null, []);
        }
        apiRequest.get(`users/${data.toString()}/detail`, (err, res) => {
          const userList = res.body.userList ? res.body.userList : [].concat(res.body);
          done(err, userList);
        });
      },
      (data, done) => {
        mentors = data.map(({id, userName}) => {
          return {id, userName, type: 'AGREE_INVITATION'};
        });
        Message.find({from: to, type: 'INVITATION', state: 0}, done);
      },
      (data, done) => {
        let mentorIds = [];
        data.forEach((item) => {
          let exist = mentorIds.find(id => {
            return id === item.to;
          });
          if (!exist) {
            mentorIds.push(item.to);
          }
        });
        done(null, mentorIds);
      },
      (data, done) => {
        if (!data.length) {
          return done(null, []);
        }
        apiRequest.get(`users/${data.toString()}/detail`, (err, res) => {
          const userList = res.body.userList ? res.body.userList : [].concat(res.body);
          let mentorObj = userList.map(({userId, userName}) => {
            return {userId, userName, type: 'INVITATION'};
          });
          done(err, mentorObj);
        });
      }], (err, data) => {
      if (data) {
        mentors = mentors.concat(data);
      }
      callback(err, mentors);
    });
  }
}

module.exports = MentorService;
