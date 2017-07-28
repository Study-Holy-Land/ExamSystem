'use strict';

var constraint = {
  newPassword: {
    presence: {message: '^请输入新密码'},
    length: {
      minimum: 8,
      maximum: 16,
      message: '^请输入合法新密码'
    }
  }
};

module.exports = constraint;
