'use strict';

require('./libs/outdatedBrowserCheck');
require('../less/register.less');
var RegisterApp = require('./component/register-page/register-app.component.jsx');


ReactDom.render(
  <RegisterApp/>,
  document.getElementById('register-container')
);

var SIZE = 0.7;

$(function () {
  $('#agreementModal').on('show.bs.modal', function () {
    $('.modal .modal-body').css('overflow-y', 'auto').css('max-height', $(window).height() * SIZE);
  });
});
