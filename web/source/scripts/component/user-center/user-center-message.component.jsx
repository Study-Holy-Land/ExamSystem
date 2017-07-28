'use strict';
import '../../../less/user-center.less';
var UserCenterStore = require('../../store/user-center/user-center-store');
var MessageManagementStore = require('../../store/user-center/message-management-store');
var MessageManagementAction = require('../../actions/user-center/message-management-action');
var MessageTabs = require('./user-center-message-tabs.component.jsx');
var MessageList = require('./user-center-message-list.component.jsx');
var Reflux = require('reflux');
var GetAccountStore = require('../../store/reuse/get-account-store');
var request = require('superagent');
var noCache = require('superagent-no-cache');
var errorHandler = require('../../../../tools/error-handler.jsx');

const hashArray = window.location.hash.split('?');
const currentHash = hashArray[0].substr(1);

var Message = React.createClass({
  mixins: [Reflux.connect(UserCenterStore), Reflux.connect(MessageManagementStore), Reflux.connect(GetAccountStore)],

  getInitialState: function () {
    return {
      currentState:  currentHash,
      messageList: [],
      pageCount: 10,
      currentPage: 1,
      totalPage: 1
    };
  },

  componentDidMount: function () {
    let page = this.state.currentPage || 1;
    this.getMessageList(page);
  },

  getMessageList(page) {
    this.setState({currentPage: page || this.state.currentPage});
    request
      .get(API_PREFIX+'messages')
      .use(noCache)
      .query({
        currentPage: page,
        pageCount: this.state.pageCount
      })
      .set('Content-Type', 'application/json')
      .use(errorHandler)
      .end((err, res) => {
        this.setState({
          messageList: res.body.message,
          totalPage: res.body.totalPage
        });

      });
  },

  render: function () {
    var classString = (this.state.currentState === 'message' ? '' : ' hide');
    const isMentor = this.state.isMentor;

    return (
      <div className={"col-md-10 col-sm-10 col-xs-12 content-padding container-fluid" + classString}>
        <div className="content">
          <div id='tabs' className='message-body'>
            <MessageTabs/>
            <MessageList totalPage={this.state.totalPage}
                         currentPage={this.state.currentPage}
                         messageList={this.state.messageList}
                         getMessageList={this.getMessageList}
                         isMentor={isMentor}/>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Message;