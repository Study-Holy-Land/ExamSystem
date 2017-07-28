'use strict';
import request from 'superagent';
import constant from '../../../mixin/constant';

export const checkLogin = (email, password, captcha) => {
  return (dispatch) => {
    request
      .post(API_PREFIX + '/login')
      .set('Content-Type', 'application/json')
      .send({
        account: email,
        password,
        captcha
      })
      .end((err, res) => {
        if (res.body.status === constant.httpCode.OK) {
          dispatch({
            type: 'JUMP_PAGE',
            isJumped: true
          });
        } else if (res.body.status === constant.httpCode.FORBIDDEN) {
          dispatch({
            type: 'SEND_ERR',
            errMsg: {
              captchaError: '验证码出错'
            }
          });
        } else {
          dispatch({
            type: 'SEND_ERR',
            errMsg: {
              emailError: '用户名或密码出错',
              message: err.message
            }
          });
        }
      });
  };
};
