'use strict';

function jumpControl (data) {
  var isLoged = data.isLoged;
  var isPaperCommited = data.isPaperCommited;
  var isDetailed = data.isDetailed;
  var isAgreed = data.isAgreed;
  var isThirdParty = data.isThirdParty;

  return [{
    originPath: [
      'homework.html',
      'logic-puzzle.html',
      'progress.html',
      'start.html',
      'dashboard.html'
    ],
    targetPath: '/register.html',
    condition: !isLoged
  }, {
    originPath: [
      'logic-puzzle.html',
      'start.html'
    ],
    targetPath: '/dashboard.html',
    condition: isLoged && isPaperCommited && isDetailed
  }, {
    originPath: [
      'homework.html',
      'logic-puzzle.html',
      'progress.html',
      'start.html',
      'dashboard.html'
    ],
    targetPath: '/user-center.html#userDetail',
    condition: isLoged && !isDetailed
  }, {
    originPath: [
      'homework.html'
    ],
    targetPath: 'dashboard.html',
    condition: !isPaperCommited
  }, {
    originPath: [
      'start.html'
    ],
    targetPath: 'dashboard.html',
    condition: isAgreed
  }, {
    originPath: [
      'user-center.html#userDetail'
    ],
    targetPath: 'register.html',
    condition: !(isLoged || isThirdParty)
  }, {
    originPath: [
      'register.html'
    ],
    targetPath: 'dashboard.html',
    condition: isLoged
  }
  ];
}
module.exports = jumpControl;
