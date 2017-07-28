'use strict';

var Reflux = require('reflux');
var RegisterableAction = require('../../actions/admin/registerable-actions');
var RegisterableStore = require('../../store/admin/registerable-store');
var constraint = require('../../../../mixin/register-constraint');
var Switch = require('react-bootstrap-switch');
require('../../../../node_modules/react-bootstrap-switch/dist/css/bootstrap3/react-bootstrap-switch.min.css');
require('../../../../node_modules/react-bootstrap-switch/dist/js/react-bootstrap-switch.min.js');

var Registerable = React.createClass({
  mixins: [Reflux.connect(RegisterableStore)],

  getInitialState: function () {
    return {
      registerable: null
    };
  },

  componentDidMount: function () {
    RegisterableAction.loadRegisterableState();
  },

  switchValue: function () {
    var value = this.refs.registerable.value();
    RegisterableAction.changeRegisterableState(value);
  },

  render: function () {
    return (
      <div>
        <div className="page-header">
          <h3>开放/关闭注册</h3>
          <hr/>
        </div>
        <Switch size="normal" state={this.state.registerable} ref="registerable" name="registerable"
                onChange={this.switchValue}/>
      </div>
    );
  }
});

module.exports = Registerable;