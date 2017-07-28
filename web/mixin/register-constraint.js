'use strict';

var constraint = {
  userName: {
    presence: {message: '^请输入昵称'},
    length: {
      maximum: 64,
      message: '^昵称最大长度64位'
    },
    format: {
      pattern: /^(?![0-9]+$)[\u4e00-\u9fa5a-zA-Z0-9_]+$/,
      message: '^只能包含字母,数字字母组合,下划线,中文'
    }
  },
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
      message: '^请输入8~16位密码'
    },
    format: {
      pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/,
      message: '^请输入字母和数字组成的密码'
    }
  }
};
module.exports = constraint;
