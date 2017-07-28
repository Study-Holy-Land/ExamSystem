'use strict';

var constraint = {
  email: {
    presence: {message: '^请输入邮箱或手机号'},
    email: {message: '^用户名为邮箱或手机号'}
  },
  mobilePhone: {
    presence: {message: '^请输入邮箱或手机号'},
    format: {
      pattern: /^1[3|4|5|8][0-9]\d{8}$/,
      message: '^用户名为邮箱或手机号'
    }
  },
  loginPassword: {
    presence: {message: '^请输入密码'},
    length: {
      minimum: 8,
      maximum: 16,
      message: '^请输入合法密码'
    }
  }
};
module.exports = constraint;
