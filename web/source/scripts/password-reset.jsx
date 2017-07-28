'use strict';


require('../less/password-reset.less');

var PasswordResetForm = require('./component/password-retrieve/password-reset-form.component.jsx');
var NewPassword = require('./component/reuse/new-password.component.jsx');

ReactDom.render(
  <PasswordResetForm>
    <NewPassword/>
  </PasswordResetForm>,
  document.getElementById('password-reset-container')
);
