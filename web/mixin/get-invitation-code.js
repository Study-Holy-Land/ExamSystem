'use strict';

var constraint = {
  email: {
    presence: {message: '^请输入邮箱'},
    email: {message: '^邮箱格式不正确'}
  }
};
module.exports = constraint;
