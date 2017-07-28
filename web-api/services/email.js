'use strict';
var nodemailer = require('nodemailer');
const config = require('config');
var emailAccount = config.get('emailAccount');
var emailPassword = config.get('emailPassword');

var constant = require('../mixin/constant');
var emailServer = {

  sendEmail: function(emailTarget, linkAddress, callback) {
    var emailContent = '尊敬的校招特训营用户，您好! <br> <br> <br>您在访问校招特训营官网时点击了"忘记密码"链接，这是一封密码重置确认邮件。<br>' +
      '您可以通过点击以下链接重置帐户密码: <div> <a href="' + linkAddress + '">' + linkAddress + '</a> </div>' +
      '<br> <br> 为保障您的帐号安全，请在24小时内点击该链接，您也可以将链接复制到浏览器地址栏访问。 若如果您并未尝试修改密码，请忽略本邮件，由此给您带来的不便请谅解。' +
      '<br> <br> 本邮件由系统自动发出，请勿直接回复！';

    var transporter = nodemailer.createTransport({
      service: '163',
      auth: {
        user: emailAccount,
        pass: emailPassword
      }

    });

    var mailOptions = {
      from: emailAccount,
      to: emailTarget,
      subject: '[校招特训营]找回您的账户密码',
      html: emailContent
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        callback(true, {
          status: constant.httpCode.NOT_FOUND
        });
      } else {
        callback(null, {
          status: constant.httpCode.OK
        });
      }
    });
  }

};

module.exports = emailServer;
