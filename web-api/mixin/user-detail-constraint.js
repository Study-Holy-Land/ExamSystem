'use strict';

var constraint = {
  school: {
    presence: {message: '^学校不能为空'},
    length: {
      maximum: 64,
      message: '^学校名称过长'
    },
    format: {
      pattern: /^[\u4E00-\u9FA5A-Za-z]+$/,
      message: '^请输入合法学校名称'
    }
  },

  name: {
    presence: {message: '^姓名不能为空'},
    format: {
      pattern: /^[\u4E00-\u9FA5A-Za-z]+$/,
      message: '^请输入合法姓名'
    },
    length: {
      maximum: 20,
      message: '^姓名过长'
    }
  },

  major: {
    presence: {message: '^专业不能为空'},
    format: {
      pattern: /\s*[\u4E00-\u9FA5A-Za-z]+\s*$/,
      message: '^请输入合法专业'
    }
  },

  degree: {
    presence: {message: '^请选择学历'}
  }
};
module.exports = constraint;
