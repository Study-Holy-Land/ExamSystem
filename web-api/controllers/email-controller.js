'use strict';

const config = require('config');
var sendCloud = config.get('sendCloud');
var request = require('superagent');

function getTableTemplate(programs) {
  var tr = programs.map((program) => {
    return `<tr>
      <td style="border-width: 1px;padding: 8px;border-style: solid;border-color: #666666;background-color: #ffffff; ">
      ${program.name}
    </td>
    <td style="border-width: 1px;padding: 8px;border-style: solid;border-color: #666666;background-color: #ffffff; ">
      ${program.programCode}
    </td>
    <td style="border-width: 1px;padding: 8px;border-style: solid;border-color: #666666;background-color: #ffffff; ">
      ${program.description}
    </td>
    </tr>`;
  }).join('\n');
  return `<table style="font-family: verdana,arial,sans-serif;font-size:11px;color:#333333;border-width: 1px;border-color: #666666;border-collapse: collapse; ">
    <tr>
        <th style="border-width: 1px;padding: 8px;border-style: solid;border-color: #666666;background-color: #dedede;">
            名称
        </th>
        <th style="border-width: 1px;padding: 8px;border-style: solid;border-color: #666666;background-color: #dedede;">
            邀请码
        </th>
         <th style="border-width: 1px;padding: 8px;border-style: solid;border-color: #666666;background-color: #dedede;">
           描述
        </th>
    </tr>
    ${tr}
    </table>
`;
}

function EmailController() {

}

EmailController.prototype.sendEmail = (req, res, next) => {
  var programs = req.body.programs;
  var userEmail = req.body.userEmail;
  var title = req.body.title;
  var html = getTableTemplate(programs);
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
        throw err;
      }
      res.send(data);
    });
};

module.exports = EmailController;
