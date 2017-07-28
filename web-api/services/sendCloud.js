'use strict';

const config = require('config');
var sendCloud = config.get('sendCloud');
var request = require('superagent');

var emailServer = {

  getPasswordTemplate: function(link) {
    return `<div>
<p>您在访问校招特训营官网时点击了"忘记密码"链接，这是一封密码重置确认邮件。</p>
<p>您可以通过点击以下链接重置帐户密码:</p>
 <div> 
 <a href=${link}>${link}</a>
 </div>
 <br /> <br /> 为保障您的帐号安全，请在30分钟内点击该链接，您也可以将链接复制到浏览器地址栏访问。 若如果您并未尝试修改密码，请忽略本邮件，由此给您带来的不便请谅解。
 <br /> <br /> 本邮件由系统自动发出，请勿直接回复！
`;
  },

  sendEmail: function(link, title, userEmail, callback) {
    var html = this.getPasswordTemplate(link);
    request.post('http://sendcloud.sohu.com/webapi/mail.send.json')
      .type('form')
      .send({
        api_user: sendCloud.api_user,
        api_key: sendCloud.api_key,
        from: sendCloud.source,
        to: userEmail,
        html: html,
        subject: title
      })
      .end((err, data) => {
        if (err) {
          callback(true, err);
        }
        callback(null, data);
      });
  }
};

module.exports = emailServer;
