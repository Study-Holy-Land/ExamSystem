'use strict';
import '../../../less/user-center.less';
var UserCenterStore = require('../../store/user-center/user-center-store');
var MessageManagementAction = require('../../actions/user-center/message-management-action');
var MessageManagementStore = require('../../store/user-center/message-management-store');
var Pagination = require('../common/pagination.component.jsx');
var Reflux = require('reflux');
var ButtonLine = React.createClass({

  handleRequest(messageId, operation, currentPage) {
    MessageManagementAction.operateMessage(messageId, operation, currentPage);
  },

  render() {
    return (
        <button type='button' className={'btn btn-xs ' + this.props.item.buttonType}
                onClick={this.handleRequest.bind(this, this.props.messageId, this.props.item.operation, this.props.currentPage)}>
          <i className={'ace-icon ' + this.props.item.icon}> </i>{this.props.item.text}
        </button>
    );
  }
});

var MessageLine = React.createClass({
  render() {
    var da = new Date(this.props.message.updatedAt);
    var year = da.getFullYear() + '年';
    var month = da.getMonth() + 1 + '月';
    var date = da.getDate() + '日';
    var data = [year, month, date].join('');

    const buttonConfiguration = this.props.isMentor ? [
      {text: '同意', buttonType: 'btn-success agree', icon: 'glyphicon glyphicon-ok', operation: 'agreement'},
      {text: '拒绝', buttonType: 'btn-danger', icon: 'fa fa-ban', operation: 'disagreement'}
    ] : [{text: '标记为已读', buttonType: 'btn-info', icon: '', operation: 'read'}];

    return (
        <tr key={this.props.message._id}>
          <td>
            {data}
            &nbsp;&nbsp;{this.props.isMentor ? '学生' : '教练'}{this.props.message.fromDetail.name}{this.props.messageType.text}
            <div className="pull-right">
              <div className={this.props.isShowButton}>
                {
                  buttonConfiguration.map((item, i) => {
                    return (
                        <ButtonLine key={i} messageId={this.props.message._id}
                                    currentPage={this.props.currentPage} item={item}/>
                    )
                  })
                }
              </div>
              <span className={this.props.isShowButton ? '' : 'hidden'}>{this.props.isRead}</span>
            </div>
          </td>
        </tr>
    );
  }
});
var MessageList = React.createClass({
  mixins: [Reflux.connect(UserCenterStore), Reflux.connect(MessageManagementStore)],

  getCurrentPageMessage(currentPage) {
    this.props.getMessageList(currentPage);
  },

  render: function () {
    var messageList = this.props.messageList || [];
    var totalPage = messageList.length < 1 ? 0 : this.props.totalPage;
    var noMeassage = <tr>
      <td>您暂时还没有消息哦&nbsp; ~^o^</td>
    </tr>;
    const isMentor = this.props.isMentor;
    const messageTypes = isMentor ? [
      {type: 'INVITATION', text: '邀请您成为他的教练'},
      {type: 'REQUEST_ANSWER', text: '请求查看答案'}] :
        [{type: 'AGREE_INVITATION', text: '同意成为你的教练'},
          {type: 'DISAGREE_INVITATION', text: '不同意成为你的教练'},
          {type: 'AGREE_REQUEST_ANSWER', text: '同意你查看答案'},
          {type: 'DISAGREE_REQUEST_ANSWER', text: '不同意你查看答案'}];

    const haveMessage = messageList.map(message => {
      return messageTypes.map((messageType, index) => {
        if (messageType.type === message.type) {
          let isShowButton = 'hidden';
          let isRead = '已读';
          if (message.state === 0) {
            isShowButton = '';
            isRead = '未读';
          }

          return (
              <MessageLine key={index} isShowButton={isShowButton} messageType={messageType}
                           message={message} currentPage={this.props.currentPage}
                           isMentor={isMentor} isRead={isRead}/>
          )
        }
      });
    });
    var resultMessages = messageList.length < 1 ? noMeassage : haveMessage;
    return (
        <div id='myTabContent' className='row tab-content'>
          <table className='table table-bordered table-striped table-hover'>
            <tbody className='table-body'>
            {resultMessages}
            </tbody>
          </table>
          <div className='col-xs-6 dataTable-pagination'>
            <Pagination totalPage={totalPage}
                        currentPage={this.props.currentPage}
                        onPageChange={this.getCurrentPageMessage}/>
          </div>
        </div>
    );
  }
});

module.exports = MessageList;