import {Component} from 'react';
import '../../style/message.less';
import MessageTabs from './messageTabs';
import MessageList from './messageList';
import superagent from 'superagent';
import noCache from 'superagent-no-cache';
import constant from '../../../mixin/constant';
import errorHandler from '../../tool/errorHandler';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';

const tabsConfiguration = [
  {activeStatus: 'active', value: '未读', tabsLink: '/unread', icon: 'fa-bell'},
  {activeStatus: '', value: '所有', tabsLink: '/', icon: 'fa-envelope'}
];

class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabsConfiguration: tabsConfiguration,
      tabsValue: 0,
      messageList: [],
      pageCount: 10,
      currentPage: 1,
      totalPage: 0
    };
  }

  getMessageList(page) {
    this.setState({currentPage: page || this.state.currentPage});
    superagent
      .get(API_PREFIX + '/messages/')
      .use(noCache)
      .query({
        currentPage: page,
        pageCount: this.state.pageCount
      })
      .set('Content-Type', 'application/json')
      .use(errorHandler)
      .end((err, res) => {
        if (res.statusCode === constant.httpCode.OK) {
          this.setState({
            messageList: res.body.message,
            totalPage: res.body.totalPage
          });
        } else {
          throw err;
        }
      });
  }

  componentDidMount() {
    let page = parseInt(this.props.uri.query.page) || 1;
    this.getMessageList(page);
  }

  onChangeTabsValue(index) {
    this.setState({
      tabsValue: index
    });
  }

  render() {
    return (
      <div id='message'>
        <div className='message-header'>
          消息中心
        </div>
        <div id='tabs' className='message-body'>
          <MessageTabs />
          <MessageList tabsConfiguration={this.state.tabsConfiguration}
                       tabsValue={this.state.tabsValue}
                       totalPage={this.state.totalPage}
                       currentPage={this.state.currentPage}
                       messageList={this.state.messageList}
                       getMessageList={this.getMessageList.bind(this)}/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => state;

export default connect(mapStateToProps)(withRouter(Messages));

