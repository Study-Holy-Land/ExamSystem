'use strict';

var constraint = {
  userName: {
    presence: {message: '^请输入昵称'},
    format: {
      pattern: /^(?![0-9]+$)[\u4e00-\u9fa5a-zA-Z0-9_]+$/,
      message: '^只能包含字母,数字字母组合,下划线,中文'
    }
  },

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

  major: {
    presence: {message: '^专业不能为空'},
    format: {
      pattern: /\s*[\u4E00-\u9FA5A-Za-z]+\s*$/,
      message: '^请输入合法专业'
    }
  },

  degree: {
    presence: {message: '^请选择学历'}
  },

  schoolProvince: {
    presence: {message: '^请选择学校所在地'}
  },

  schoolCity: {
    presence: {message: '^请选择学校所在地'}
  },

  entranceYear: {
    presence: {message: '^请选择入学年份'}
  }
};
module.exports = constraint;
