'use strict';

function jumpControl(req) {
  var isLogined = Boolean(req.session.user); // 只要判断是否具有session
  var isAdmin = isLogined ? (Number(req.session.user.role) === 9) : false;

  return [{
    originPath: [
      '/reuse/account',
      /homework\/scoring$/
    ],
    condition: !isLogined,
    status: 401
  }, {
    originPath: [
      '/admin/registerable',
      '/admin/channel',
      '/report/paper/1/scoresheet'
    ],
    condition: !isLogined || !isAdmin,
    status: 403
  }];
}
module.exports = jumpControl;
