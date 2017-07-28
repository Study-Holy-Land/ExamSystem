'use strict';

var Reflux = require('reflux');
var QAPageUpdateAction = require('../../actions/admin/qa-page-update-actions');
var QAPageUpdateStore = require('../../store/admin/qa-page-update-store');
var constraint = require('../../../../mixin/register-constraint');

var QAPageUpdate = React.createClass({
  mixins: [Reflux.connect(QAPageUpdateStore)],

  getInitialState: function () {
    return {
      updateStatus: '',
      qaResourceUrl: ''
    };
  },

  componentDidMount: function () {
    QAPageUpdateAction.init();
  },

  componentDidUpdate: function () {
    this.refs.url.value = this.state.qaResourceUrl;
    console.log(this.state.qaResourceUrl);
  },

  handleClick: function () {
    var url = this.refs.url.value.trim();
    QAPageUpdateAction.updateQAPage(url);
  },

  render: function () {
    var info = null;
    if (this.state.updateStatus === 'success') {
      info = (
        <h4 className="text-success">更新成功!</h4>
      )
    } else if (this.state.updateStatus === 'failed') {
      info = (
        <h4 className="text-danger">更新失败!Q&A页面地址为空!</h4>
      )
    }

    return (
      <div>
        <div className="page-header">
          <h3>更新Q&A页面</h3>
          <hr/>
        </div>
        <div className="row">
          <div className="col-md-2">
            <button type="button" className="btn btn-primary btn-lg" onClick={this.handleClick}>点我更新</button>
          </div>
          <div className="col-md-5">
            <input className="form-control" type="text" placeholder="输入文档地址,若为空则使用默认值!" ref="url"/>
          </div>
          <div className="col-md-4 col-md-offset-1">
            {info}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = QAPageUpdate;