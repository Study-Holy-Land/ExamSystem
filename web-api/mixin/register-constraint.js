'use strict';

var constraint = {
  email: {
    presence: {message: '^请输入邮箱'},
    email: {message: '^请输入正确邮箱'}
  },
  mobilePhone: {
    presence: {message: '^请输入手机号'},
    format: {
      pattern: /^1[3|4|5|6|7|9|8][0-9]\d{8}$/,
      message: '^请输入合法手机号'
    }
  },
  password: {
    presence: {message: '^请输入密码'},
    length: {
      minimum: 8,
      maximum: 16,
      message: '^请输入合法密码'
    }
  }
};
module.exports = constraint;
