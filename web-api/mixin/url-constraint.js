'use strict';

var constraint = {
  githubUrl: {
    presence: {message: '^请输入仓库地址'},
    format: {
      pattern: /^(?:https:\/\/)?(?:github\.com\/)(?:[^ ]+)(?:\/)(?:[^ ]+)$/,
      message: '^仓库地址不正确'
    }
  }
};

module.exports = constraint;
