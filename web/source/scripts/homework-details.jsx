'use strict';

require('../less/homework-details.less');
var HomeworkDetailsComponent = require('./component/homework-details/homework-details-component.jsx');

ReactDom.render(
  <div className="container-fluid">
    <HomeworkDetailsComponent/>
  </div>,
  document.getElementById('homework-details')
);
