'use strict';

var ExportGrades = React.createClass({

  getInitialState: function () {
    return {};
  },

  componentDidMount: function () {
  },

  render: function () {

    return (
      <div>
        <div className="page-header">
          <h3>导出成绩</h3>
          <hr/>
        </div>
        <a type="button" className="btn btn-primary btn-lg" href={API_PREFIX+"report/paper/1/scoresheet"}
           target="_blank">点我导出</a>
      </div>
    );
  }
});

module.exports = ExportGrades;