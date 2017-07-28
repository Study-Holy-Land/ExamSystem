export default {
  userName: {
    presence: {message: '^请输入昵称'}
  },
  email: {
    presence: {message: '^请输入邮箱'},
    email: {message: '^请输入合法邮箱'}
  },
  mobilePhone: {
    presence: {message: '^请输入手机号'},
    format: {
      pattern: /^1[3|4|5|8][0-9]\d{8}$/,
      message: '^请输入合法的手机号'
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
