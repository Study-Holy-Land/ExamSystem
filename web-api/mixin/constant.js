'use strict';

var constant = {
  httpCode: {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    REDIRECTED: 301,
    NOT_FOUND: 404,
    UNAUTHORIZED: 401,
    BAD_REQUEST: 400,
    DUPLICATE_CONTENT: 409,
    PRECONDITION_FAILED: 412,
    FORBIDDEN: 403,
    INTERNAL_SERVER_ERROR: 500
  },
  time: {
    MINUTE_PER_HOUR: 60,
    SECONDS_PER_MINUTE: 60,
    HOURS_PER_DAY: 24,
    MILLISECOND_PER_SECONDS: 1000
  },
  homeworkQuizzesStatus: {
    LOCKED: 1,
    ACTIVE: 2,
    PROGRESS: 3,
    SUCCESS: 4,
    ERROR: 5,
    LINE_UP: 6
  },
  backConstant: {
    MOBILE_PHONE_LENGTH: 11,
    PASSWORD_MIN_LENGTH: 8,
    PASSWORD_MAX_LENGTH: 16,
    SUCCESSFUL_STATUS: 200,
    FORBIDDEN: 403,
    FAILING_STATUS: 404,
    SERVER_ERROR: 500,
    EMAIL_REPEAT: 22,
    MOBILE_PHONE_REAPET: 33
  },
  sectionStatus: {
    NOTSTART: 3,
    INCOMPLETE: 0,
    COMPLETE: 1,
    TIMEOUT: 2
  },
  createHomeworkStatus: {
    ERROR: 0,
    PEDDING: 1,
    SUCCESS: 2
  },
  addStackStatus: {
    PENDING: 0,
    SUCCESS: 1,
    ERROR: 2
  },
  roleValidate: {
    EMAIL_REPEAT: '该邮箱已被注册',
    MOBILE_PHONE_REPEAT: '该手机号已被注册'
  }
};

module.exports = constant;
