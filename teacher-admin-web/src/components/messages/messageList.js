import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import superagent from 'superagent';
import constant from '../../../mixin/constant';
import {PaginationWrapper} from '../common/';

const buttonConfiguration = [
  {text: '同意', buttonType: 'btn-success', icon: 'glyphicon glyphicon-ok', operation: 'agreement'},
  {text: '拒绝', buttonType: 'btn-danger', icon: 'fa fa-ban', operation: 'disagreement'}
];

const messageTypes = [
  {type: 'INVITATION', text: '邀请您成为他的教练'},
  {type: 'REQUEST_ANSWER', text: '请求查看答案'}
];

class ButtonConfiguration extends Component {
  getMessageList() {
    this.props.getMessageList();
  }

  handleRequest(messageId, operation, index) {
    superagent
      .put(API_PREFIX + `/messages/${messageId}/${operation}`)
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        if (res.statusCode === constant.httpCode.NO_CONTENT) {
          this.getMessageList(this.props.currentPage);
        } else {
          throw err;
        }
      });
  }

  render() {
    return (
      <div className='button-item'>
        {this.props.buttonConfiguration.map((item, buttonIndex) => {
          const index = this.props.tabsValue;
          return (
            <button type='button' key={buttonIndex} className={'btn btn-xs ' + item.buttonType}
                    onClick={this.handleRequest.bind(this, this.props.messageId, item.operation, index)}>
              <i className={'ace-icon ' + item.icon}> </i>{item.text}
            </button>
          );
        })}
      </div>
    );
  }
}

class MessageLine extends Component {
  getMessageList() {
    this.props.getMessageList();
  }

  render() {
    let noMeassage = <tr>
      <td>您暂时还没有消息哦&nbsp; ~^o^</td>
    </tr>;
    let haveMessage = this.props.messageList.map((message, index) => {
      const year = new Date(message.updatedAt).getFullYear();
      const month = new Date(message.updatedAt).getMonth() + 1;
      const date = new Date(message.updatedAt).getDate();
      const time = `${year}年${month}月${date}日`;
      return messageTypes.map(messageType => {
        if (messageType.type === message.type) {
          let isShowButton = 'hidden';
          let isRead = '已读';
          if (message.state === 0) {
            isShowButton = '';
            isRead = '未读';
          }
          return (
            <tr key={index}>
              <td>
                {time}&nbsp;&nbsp;
                学生{message.fromDetail.name}{messageType.text}
                <div className='pull-right'>
                  <div className={isShowButton} id='button-agree-refuse'>
                    <ButtonConfiguration messageId={message._id}
                                         buttonConfiguration={this.props.buttonConfiguration}
                                         getMessageList={this.getMessageList.bind(this)}
                                         tabsValue={this.props.tabsValue}/>
                  </div>
                  <span className='isRead'>{isRead}</span>
                </div>
              </td>
            </tr>
          );
        }
      });
    });

    return (
      <div className='tab-pane fade in active unread' id='unread'>
        <table className='table table-bordered table-striped table-hover'>
          <tbody className='table-body'>
          {this.props.messageList.length === 0 ? noMeassage : haveMessage}
          </tbody>
        </table>
      </div>
    );
  }
}

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messageList: [],
      buttonConfiguration: buttonConfiguration
    };
  }

  getMessageList() {
    this.props.getMessageList(this.props.currentPage);
  }

  getCurrentPageMessage(currentPage) {
    this.props.getMessageList(currentPage);
  }

  render() {
    const messageList = this.props.messageList || [];
    return (
      <div id='myTabContent' className='row tab-content'>
        <MessageLine messageList={messageList}
                     buttonConfiguration={this.state.buttonConfiguration}
                     getMessageList={this.getMessageList.bind(this)}
                     currentPage={this.props.currentPage}
                     tabsValue={this.props.tabsValue}/>
        <div className='mentor-message-pagination'>
          <PaginationWrapper totalPage={this.props.totalPage} currentPage={this.props.currentPage}
                             onPageChange={this.getCurrentPageMessage.bind(this)}/>
        </div>
      </div>
    );
  }
}

MessageList.propTypes = {
  tabsConfiguration: React.PropTypes.array.isRequired,
  tabsValue: React.PropTypes.number.isRequired,
  messageList: React.PropTypes.array,
  getMessageList: React.PropTypes.func.isRequired
};

export default connect(() => {
  return {};
})(withRouter(MessageList));
