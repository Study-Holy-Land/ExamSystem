'use strict';

require('../less/password-retrieve.less');

var PasswordRetrieveForm = require('./component/password-retrieve/password-retrieve-form.component.jsx');

ReactDom.render(
  <PasswordRetrieveForm/>,
  document.getElementById('password-retrieve-container')
);
