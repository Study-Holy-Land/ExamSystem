const moment = require('moment');
const apiRequest = require('../api-request');
const constant = require('../../mixin/constant');

const hour = constant.time.HOURS_PER_DAY;
const minute = constant.time.MINUTE_PER_HOUR;
const second = constant.time.SECONDS_PER_MINUTE;

const dayToSecond = second * minute * hour;
const hourToSecond = second * minute;
const minutesToSecond = minute;

function blankQuizFunc({paperId, userId, sectionId}, callback) {
  apiRequest.get(`papers/${paperId}/logicPuzzle`, {userId}, callback);
}

function homeworkQuizFunc({paperId, userId, sectionId}, callback) {
  apiRequest.get(`papers/${paperId}/users/${userId}/homeworkHistory`, {sectionId}, callback);
}

function basicQuizFunc({paperId, userId, sectionId}, callback) {
  apiRequest.get(`papers/${paperId}/basicQuizzes`, {userId, sectionId}, callback);
}

function blankQuizHandler(sectionNumber, content, sections, i) {
  const {correctNumber, itemNumber, startTime, endTime} = sectionNumber['section' + i];
  if (correctNumber !== undefined && itemNumber !== undefined) {
    content += correctNumber < 2 ? '0%,' : (correctNumber - 2) / itemNumber * 100 + '%,';
  } else {
    content += 'N/A,';
  }
  content += (startTime ? moment.unix(startTime).format('YYYY-MM-DD HH:mm:ss') : 'N/A') + ',';
  content += (endTime ? calcLogicPuzzleElapsedTime(startTime, endTime) : 'N/A') + ',';
  return content;
}

function homeworkQuizHandler(sectionNumber, content, sections, i) {
  const items = sectionNumber['section' + i].items;
  const homeworkCompletion = (items.length / sections[i - 1].quizzes.length) * 100 + '%';
  content += (homeworkCompletion || 'N/A') + ',';
  content += (items[0].startTime ? moment.unix(items[0].startTime).format('YYYY-MM-DD HH:mm:ss') : 'N/A') + ',';
  content += (items[items.length - 1].commitTime ? calcHomeworkElapsedTime(items[items.length - 1].commitTime - items[0].startTime) : 'N/A') + ',';
  return content;
}

function basicQuizHandler(sectionNumber, content, sections, i) {
  const {correctCount, startTime, endTime, totalCount} = sectionNumber['section' + i];
  if (correctCount !== undefined && totalCount !== undefined) {
    content += correctCount / totalCount * 100 + '%,';
  } else {
    content += 'N/A,';
  }
  content += (startTime ? moment.unix(startTime).format('YYYY-MM-DD HH:mm:ss') : 'N/A') + ',';
  content += (endTime ? calcLogicPuzzleElapsedTime(startTime, endTime) : 'N/A') + ',';
  return content;
}

function calcLogicPuzzleElapsedTime(startTime, endTime) {
  let time = Math.floor((endTime - startTime) / 1000);

  let elapsedHour = 0;
  let elapsedMinutes = 0;

  elapsedHour = Math.floor(time / hourToSecond);
  time -= hourToSecond * elapsedHour;
  elapsedMinutes = Math.floor(time / minutesToSecond);
  time -= minutesToSecond * elapsedMinutes;

  return elapsedHour + '小时' + elapsedMinutes + '分' + time + '秒';
}

function calcHomeworkElapsedTime(elapsedTime) {
  if (!elapsedTime) {
    return '--';
  }
  var elapsedDay = 0;
  var elapsedHour = 0;
  var elapsedMinutes = 0;
  var time = Math.floor(elapsedTime / 1000);

  elapsedDay = Math.floor(time / dayToSecond);
  time -= elapsedDay * dayToSecond;
  elapsedHour = Math.floor(time / hourToSecond);
  time -= hourToSecond * elapsedHour;
  elapsedMinutes = Math.floor(time / minutesToSecond);

  return elapsedDay + '天' + elapsedHour + '小时' + elapsedMinutes + '分';
}

function isHomeworkExist(sections) {
  return sections.find(({sectionType}) => sectionType === 'homeworkQuizzes');
}

function infoContentHandler(school, major, degree, entranceYear, content) {
  content += (school || 'N/A') + ',';
  content += (major || 'N/A') + ',';
  content += (degree || 'N/A') + ',';
  content += (entranceYear || 'N/A') + ',';
  return content;
}

module.exports = {
  blankQuizFunc,
  blankQuizHandler,
  homeworkQuizFunc,
  homeworkQuizHandler,
  basicQuizFunc,
  basicQuizHandler,
  calcLogicPuzzleElapsedTime,
  calcHomeworkElapsedTime,
  isHomeworkExist,
  infoContentHandler
};
