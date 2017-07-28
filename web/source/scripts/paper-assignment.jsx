'use strict';

require('../less/paper-assignment.less');
require('../less/get-account.less');

var Navigation = require('./component/navigation/navigation.component.jsx');
var Account = require('./component/reuse/get-account.component.jsx');

var Reflux = require('reflux');
var validate = require('validate.js');
var PaperAssignmentAction = require('./actions/paper-assignment/paper-assignment-actions');
var PaperAssignmentStore = require('./store/paper-assignment/paper-assignment-store.js');
var constraint = require('../../mixin/register-constraint');

function getError(validateInfo, field) {
  if (validateInfo && validateInfo[field] && validateInfo[field].length > 0) {
    return validateInfo[field][0];
  }
  return '';
}

var PaperAssignment = React.createClass({
  mixins: [Reflux.connect(PaperAssignmentStore)],

  getInitialState: function () {
    return {
      links: [],
      papers: [],
      phoneNumberError: ''
    };
  },

  componentDidMount: function () {
    PaperAssignmentAction.getLinks();
    PaperAssignmentAction.getPaperName();
  },

  validate: function () {
    var phoneNumber = this.refs.phoneNumber.value.trim();
    var valObj = {};
    valObj.mobilePhone = phoneNumber;
    var result = validate(valObj, constraint);
    var error = getError(result, 'mobilePhone');

    this.setState({phoneNumberError: error});
  },

  handleAddClick: function () {
    var phoneNumber = this.refs.phoneNumber.value;
    var paperId = this.refs.papers.value;
    var options = this.refs.papers.options;
    var paperName = options[options.selectedIndex].text;

    this.validate();

    if (!this.state.phoneNumberError) {
      PaperAssignmentAction.addLink({
        phoneNumber: phoneNumber,
        paperId: paperId,
        paperName: paperName
      }, this.state.links)
    }
  },

  handleDeleteClick: function (evt) {
    var deleteIndex = evt.target.id;
    PaperAssignmentAction.deleteLink({
      phoneNumber: this.state.links[deleteIndex].phoneNumber,
      paperName: this.state.links[deleteIndex].paperName
    }, this.state.links, deleteIndex)
  },

  render: function () {
    var linksHtml = this.state.links.map((link, index) => {
      if (link.delete === true) {
        return (
          <tr key={index}>
            <td className="drop-little">
              <span>{link.phoneNumber}</span>
            </td>
            <td className="drop-little">
              <span>{link.paperName}</span>
            </td>
            <td>
              <span id={index}>已删除</span>
            </td>
          </tr>
        );
      } else {
        return (
          <tr key={index}>
            <td className="drop-little">
              <span>{link.phoneNumber}</span>
            </td>
            <td className="drop-little">
              <span>{link.paperName}</span>
            </td>
            <td>
              <i id={index} onClick={this.handleDeleteClick}>删除</i>
            </td>
          </tr>
        );
      }
    });

    var papersHtml = this.state.papers.map((paper, index) => {
      var paperId = paper.uri.split('/')[1];
      return (
        <option key={index} value={paperId}>{paper.paperName}</option>
      );
    });

    return (
      <div>
        <header>
          <Navigation>
            <Account />
          </Navigation>
        </header>
        <div className="row">
          <div className="col-md-8 col-md-offset-2 center-content">
            <table className="table table-bordered">
              <thead>
              <tr>
                <th>预置手机号码</th>
                <th>对应试卷</th>
                <th>对应操作</th>
              </tr>
              </thead>
              <tbody>
              {linksHtml}
              <tr>
                <td>
                  <input ref="phoneNumber" type="text" className="form-control" onBlur={this.validate}/>
                  <div
                    className={'lose' + (this.state.phoneNumberError === '' ? ' hide' : '')}>{this.state.phoneNumberError}
                  </div>
                </td>
                <td>
                  <select className="form-control" ref="papers" name="papers" id="papers">
                    {papersHtml}
                  </select>
                </td>
                <td>
                  <i onClick={this.handleAddClick}>增加</i>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
});
ReactDom.render(<PaperAssignment />, document.getElementById('assignment-container'));