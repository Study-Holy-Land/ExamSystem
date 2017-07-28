'use strict';
var UserCenterStore = require('../../store/user-center/user-center-store');
var MentorManagementStore = require('../../store/user-center/mentor-management-store');
var MentorManagementAction = require('../../actions/user-center/mentor-management-action');
var Reflux = require('reflux');
var Rx = require('rx');

var MentorSearch = React.createClass({
  mixins: [Reflux.connect(UserCenterStore), Reflux.connect(MentorManagementStore)],

  getInitialState: function () {
    return {
      mentorList: this.props.mentorList || [],
      mentorSearchList: [],
      searchResult: '',
      inputId: '',
      isDisabled: true,
      errorInfo: ''
    };
  },
  componentDidUpdate() {
    let width = document.getElementById("email").offsetWidth;
    document.getElementById("searchList").style.width = width + 'px';

  },

  componentDidMount() {
    window.onresize = () => {
      let width = document.getElementById("email").offsetWidth;
      document.getElementById("searchList").style.width = width + 'px';

    };

    Rx.Observable.fromEvent(this.inputInfo, 'keyup')
        .pluck('target', 'value')
        .map(text => text.trim())
        .filter(text => text.length >= 3)
        .debounce(1000)
        .distinctUntilChanged()
        .forEach(item => {
          MentorManagementAction.searchMentor(item);
        })
  },

  handleClick: function ({userName, id}) {
    this.inputInfo.value = userName;
    this.setState({
      inputId: id,
      isDisabled: false
    });
  },

  addMentor: function () {

    let mentors = this.state.mentorList;
    let exit = mentors.find((item) => {
      return item.userId == this.state.inputId
    });
    if (exit) {
      this.setState({
        mentorSearchList: [],
        errorInfo: '已经添加过'
      });
    } else if (mentors.length) {
      this.setState({
        mentorSearchList: [],
        errorInfo: '只能添加一个教练'
      });
    } else {
      MentorManagementAction.createMessages(this.state.inputId);
      this.inputInfo.value = '';
      this.setState({mentorSearchList: []});
    }
  },

  render() {
    var mentorSearchList = this.state.mentorSearchList || [];

    return (
        <div>
          <div className="search row">
            <div className="input-group col-lg-6 search-mentor-margin">

              <input id="email" type="text" className="form-control search-mentor-frame"
                     placeholder="请输入教练邮箱"
                     ref={(ref) => {
                       this.inputInfo = ref;
                     }}/>
              <div className="input-group-btn">
                <button type="submit" className="btn btn-primary add-mentor-btn" disabled={this.state.isDisabled}
                        onClick={this.addMentor}>确定
                </button>
              </div>
            </div>
            <div id="searchList" className={"search-mentor-list col-md-8 " + (mentorSearchList.length ? '' : 'hidden')}>
              <ul>
                {
                  mentorSearchList.map(({userName, id, email}, index) => {
                    return (
                        <li key={index}
                            onClick={this.handleClick.bind(this, {
                              userName,
                              id,
                              email
                            })}>{userName} {'<' + email + '>'}</li>
                    )
                  })
                }
              </ul>
            </div>

            <div className={mentorSearchList.length ? 'hidden' : ''}>
              {this.state.searchResult ? '没有搜索到' : this.state.errorInfo}
            </div>
          </div>
        </div>
    );
  }
});

module.exports = MentorSearch;
