'use strict';
require('../less/thridParty-userDetail.less');
var Input = require('react-bootstrap/lib/Input');
var validate = require('validate.js');
var constraint = require('../../mixin/user-detail-constraint');
var constant = require('../../mixin/constant');
var getError = require('../../mixin/get-error');
var moment = require('moment');
var getQueryString = require('../../tools/getQueryString');
var errorHandler = require('../../tools/error-handler.jsx');
var superAgent = require('superagent');
var page = require('page');
var {cookie} = require('react-cookie-banner');

var $ = jQuery;
require('./libs/jquery.cxselect.js');
var data = require('./libs/cityData.js');

const infoWay = [
  {label: '高校就业网', isChecked: false},
  {label: '学校BBS论坛', isChecked: false},
  {label: '学校官方微信', isChecked: false},
  {label: '实习僧', isChecked: false},
  {label: '牛客网', isChecked: false},
  {label: '老师推荐', isChecked: false},
  {label: '同学告知', isChecked: false},
  {label: '社团推荐', isChecked: false},
  {label: '学校海报及传单', isChecked: false},
  {label: 'ThoughtWorks官方平台', isChecked: false}
];

var ThridPartyUserDetail = React.createClass({
  getInitialState: function () {
    return {
      userName: '',
      school: '',
      schoolProvince: '',
      schoolCity: '',
      name: '',
      mobilePhone: '',
      email: '',
      gender: 'M',
      major: '',
      degree: '',
      entranceYear: '',
      schoolError: '',
      userNameError: '',
      schoolProvinceError: '',
      schoolCityError: '',
      nameError: '',
      emailError: '',
      mobilePhoneError: '',
      majorError: '',
      degreeError: '',
      entranceYearError: '',
      submitBtnDisabled: 'disabled',
      channel: [],
      channelsInfo: {otherChannel: '', chooseChannels: infoWay}
    };
  },

  componentDidMount: function () {
    if (this.state.gender === 'M') {
      this.refs.male.checked = true;
    } else {
      this.refs.female.checked = true;
    }

    var cityData = data();

    $('#element_id').cxSelect({
      selects: ['province', 'city'],
      url: cityData
    });

    setTimeout(() => {
      $('.province').trigger('change');
      $('.city').val(this.state.schoolCity);
    }, 500);
  },

  handleChange: function (evt) {
    var newState = evt.target.value;
    var stateName = evt.target.name;

    this.setState({[stateName]: newState});
  },

  handleGenderChange: function (index) {
    if (index === 1) {
      this.setState({genderName: 'F'});
    }
  },

  handleChooseChannelChange: function (e) {
    const isChecked = e.target.checked;
    const label = e.target.value;
    let channelsInfo = this.state.channelsInfo;

    channelsInfo.chooseChannels = channelsInfo.chooseChannels.map(item => {
      item.isChecked = item.label === label ? isChecked : item.isChecked;
      return item;
    });
    this.setState({channelsInfo});
  },

  handleOtherChannelChange: function (e) {
    const otherChannel = e.target.value;
    this.setState({
      channelsInfo: {otherChannel: otherChannel, chooseChannels: infoWay}
    })
  },

  validate: function (event) {
    var target = event.target;
    var value = target.value;
    var name = target.name;
    var valObj = {};

    valObj[name] = value;
    var result = validate(valObj, constraint);
    var error = getError(result, name);
    var stateObj = {};

    stateObj[name + 'Error'] = error;
    this.setState(stateObj);
  },

  integrateChannel: function () {
    let channel = this.state.channelsInfo.chooseChannels.filter(item => item.isChecked === true)
        .map(item => item.label);
    if (this.state.channelsInfo.otherChannel) {
      channel = channel.concat(this.state.channelsInfo.otherChannel);
    }
    return channel;
  },

  update: function (evt) {
    evt.preventDefault();
    var thirdPartyUserId = getQueryString('thirdPartyUserId');
    const channel = this.integrateChannel();
    var programCode = cookie('program');
    var userInfo = {
      userName: this.state.userName,
      school: this.state.school,
      name: this.state.name,
      gender: this.state.gender,
      major: this.state.major,
      degree: this.state.degree,
      mobilePhone: this.state.mobilePhone,
      email: this.state.email,
      schoolProvince: this.state.schoolProvince,
      schoolCity: this.state.schoolCity,
      entranceYear: this.state.entranceYear,
      channel: channel,
      thirdPartyUserId,
      programCode
    };

    superAgent.post(API_PREFIX + 'user-detail/weChat')
        .send({userInfo})
        .use(errorHandler)
        .end((err, res) => {
          if (err) {
            if (res.statusCode === constant.httpCode.DUPLICATE_CONTENT) {
              if (res.body.msg === 'mobilePhone Exist') {
                this.setState({
                  mobilePhoneError: '手机号已被使用'
                });
                return;
              } else if (res.body.msg === 'email Exist') {
                this.setState({
                  emailError: '邮箱已被使用'
                });
                return;
              }
            } else {
              throw err;
            }
          }
          page('paper-list.html');
        })
  },

  getDisabled: function () {
    const base = this.state;
    const userBaseInfo = base.userName && base.school && base.schoolProvince && base.schoolCity && base.name && base.name && base.mobilePhone && base.email && base.gender && base.major && base.degree && base.entranceYear;
    const errMessage = base.schoolError && base.userNameError && base.schoolProvinceError && base.schoolCityError && base.nameError && base.emailError && base.mobilePhoneError && base.majorError && base.degreeError && base.entranceYearError;
    const channelsInfo = this.integrateChannel();
    if (userBaseInfo && channelsInfo.length > 0 && !errMessage) {
      return '';
    } else {
      return 'disabled';
    }
  },

  render: function () {
    var tags = [
      {genderName: 'male', label: '男'},
      {genderName: 'female', label: '女'}
    ];
    var endEntranceYear = moment.unix(new Date() / constant.time.MILLISECOND_PER_SECONDS).format('YYYY');

    var indents = [];
    for (var i = 0; i < 12; i++) {
      indents.push(<option key={i} value={endEntranceYear - i}>{endEntranceYear - i}</option>);
    }

    var entranceYear =
        <select ref='entranceYear' placeholder='入学年份' name='entranceYear' value={this.state.entranceYear}
                onChange={this.handleChange}
                className={'form-control' + (this.state.entranceYearError === '' ? '' : ' select')}>

          <option value=''>请选择</option>
          {indents}
        </select>;

    return (
        <div className={'col-md-12 col-sm-12 col-xs-12'}>
          <div className='content'>
            <h1 className="user-remind">请完善个人信息</h1>
            <form className='form-horizontal form-top-height' onSubmit={this.update}
                  action='user-center.html#userDetail'>
              <div id='account-info'>


                <label htmlFor='userName' className='col-sm-4 col-md-4 control-label'>昵称<span
                    className="error alert alert-danger">*</span></label>
                <div className={'form-group has-' + (this.state.userNameError === '' ? '' : 'error')}>
                  <div className='col-sm-4 col-md-4'>
                    <input type='text' className='form-control' id='userName' aria-describedby='helpBlock2'
                           placeholder='昵称'
                           onChange={this.handleChange} ref='userName' name='userName' value={this.state.userName}
                           onBlur={this.validate}/>
                  </div>
                  <div className={'error alert alert-danger' + (this.state.userNameError === '' ? ' hide' : '')}
                       role='alert'>
                    <span className='glyphicon glyphicon-exclamation-sign' aria-hidden='true'/>
                    {this.state.userNameError}
                  </div>
                </div>

                <label htmlFor='inputSchool' className='col-sm-4 col-md-4 control-label'>学校<span
                    className="error alert alert-danger">*</span></label>
                <div className={'form-group has-' + (this.state.schoolError === '' ? '' : 'error')}>
                  <div className='col-sm-4 col-md-4'>
                    <input type='text' className='form-control' id='inputSchool' aria-describedby='helpBlock2'
                           placeholder='学校'
                           onChange={this.handleChange} ref='school' name='school' value={this.state.school}
                           onBlur={this.validate}/>
                  </div>
                  <div className={'error alert alert-danger' + (this.state.schoolError === '' ? ' hide' : '')}
                       role='alert'>
                    <span className='glyphicon glyphicon-exclamation-sign' aria-hidden='true'/>
                    {this.state.schoolError}
                  </div>
                </div>

                <label htmlFor='inputSchoolInfo' className='col-sm-4 col-md-4 control-label'>学校所在地<span
                    className="error alert alert-danger">*</span></label>
                <div className='form-group'>
                  <div id="element_id" className="col-sm-4 col-md-4 school-info" onBlur={this.validate}>
                    <div className="col-md-6 col-xs-6">
                      <select
                          className={"form-control province" + (this.state.schoolProvinceError === '' ? '' : ' select')}
                          name="schoolProvince"
                          value={this.state.schoolProvince} onChange={this.handleChange}/>
                    </div>
                    <div className="col-md-6 col-xs-6">
                      <select className={"form-control city" + (this.state.schoolCityError === '' ? '' : ' select')}
                              name="schoolCity"
                              value={this.state.schoolCity} onChange={this.handleChange}/>
                    </div>
                  </div>
                  <div
                      className={'error alert alert-danger' + (this.state.schoolProvinceError === '' && this.state.schoolCityError === '' ? ' hide' : '')}
                      role='alert'>
                    <span className='glyphicon glyphicon-exclamation-sign' aria-hidden='true'/>
                    {this.state.schoolProvinceError || this.state.schoolCityError}
                  </div>
                </div>

                <label htmlFor='inputName' className='col-sm-4 col-md-4 control-label'>姓名<span
                    className="error alert alert-danger">*</span></label>
                <div className={'form-group has-' + (this.state.nameError === '' ? '' : 'error')}>
                  <div className='col-sm-4 col-md-4'>
                    <input type='text' className='form-control' id='inputName' aria-describedby='helpBlock2'
                           placeholder='姓名'
                           onChange={this.handleChange} name='name' ref='name' value={this.state.name}
                           onBlur={this.validate}/>
                  </div>
                  <div className={'error alert alert-danger' + (this.state.nameError === '' ? ' hide' : '')}
                       role='alert'>
                    <span className='glyphicon glyphicon-exclamation-sign' aria-hidden='true'/>
                    {this.state.nameError}
                  </div>
                </div>

                <label htmlFor='inputMobilePhone' className='col-sm-4 col-md-4 control-label'>手机<span
                    className="error alert alert-success">*</span></label>
                <div className={'form-group has-' + (this.state.mobilePhoneError === '' ? '' : 'error')}>
                  <div className='col-sm-4 col-md-4'>
                    <input type='text' className='form-control' id='inputMobilePhone' placeholder='手机'
                           onChange={this.handleChange} ref='mobilePhone' name='mobilePhone'
                           value={this.state.mobilePhone}
                           onBlur={this.validate}/>
                  </div>
                  <div className={'error alert alert-danger' + (this.state.mobilePhoneError === '' ? ' hide' : '')}
                       role='alert'>
                    <span className='glyphicon glyphicon-exclamation-sign' aria-hidden='true'/>
                    {this.state.mobilePhoneError}
                  </div>
                </div>

                <label htmlFor='inputEmail' className='col-sm-4 col-md-4 control-label'>邮箱<span
                    className="error alert alert-success">*</span></label>
                <div className={'form-group has-' + (this.state.emailError === '' ? '' : 'error')}>
                  <div className='col-sm-4 col-md-4'>
                    <input type='text' className='form-control' id='inputEmail' placeholder='邮箱'
                           onChange={this.handleChange} ref='email' name='email' value={this.state.email}
                           onBlur={this.validate}/>
                  </div>
                  <div className={'error alert alert-danger' + (this.state.emailError === '' ? ' hide' : '')}
                       role='alert'>
                    <span className='glyphicon glyphicon-exclamation-sign' aria-hidden='true'/>
                    {this.state.emailError}
                  </div>
                </div>

                <label htmlFor='inputGender' className='col-sm-4 col-md-4 control-label'>性别<span
                    className="error alert alert-danger">*</span></label>
                <div className='form-group'>
                  <div className="col-sm-4 col-md-4">
                    {tags.map((item, index) => {
                      return (
                          <div key={index} className="col-sm-3 col-md-3">
                            <input type="radio" name="gender" className="gender" id={item.genderName} value={this.label}
                                   onChange={this.handleGenderChange.bind(this, index)} ref={item.genderName}/>
                            <label htmlFor={item.genderName}>{item.label}</label>
                          </div>
                      );
                    })}

                  </div>
                </div>

                <label htmlFor='inputMajor' className='col-sm-4 col-md-4 control-label'>专业<span
                    className="error alert alert-danger">*</span></label>
                <div className={'form-group has-' + (this.state.majorError === '' ? '' : 'error')}>
                  <div className='col-sm-4 col-md-4'>
                    <input type='text' className='form-control' id='inputMajor' aria-describedby='helpBlock2'
                           placeholder='专业'
                           onChange={this.handleChange} name='major' ref='major' value={this.state.major}
                           onBlur={this.validate}/>
                  </div>
                  <div className={'error alert alert-danger' + (this.state.majorError === '' ? ' hide' : '')}
                       role='alert'>
                    <span className='glyphicon glyphicon-exclamation-sign' aria-hidden='true'/>
                    {this.state.majorError}
                  </div>
                </div>

                <label htmlFor='inputDegree' className='col-sm-4 col-md-4 control-label'>学历学位<span
                    className="error alert alert-danger">*</span></label>
                <div className='form-group'>
                  <div className='col-sm-4 col-md-4' onBlur={this.validate}>
                    <select ref='degree' placeholder='学历学位' name='degree' value={this.state.degree}
                            onChange={this.handleChange}
                            className={'form-control' + (this.state.degreeError === '' ? '' : ' select')}>
                      <option value=''>请选择</option>
                      <option value='专科'>专科及以下</option>
                      <option value='本科'>本科</option>
                      <option value='硕士'>硕士</option>
                      <option value='博士'>博士</option>
                    </select>
                  </div>

                  <div className={'error alert alert-danger' + (this.state.degreeError === '' ? ' hide' : '')}
                       role='alert'>
                    <span className='glyphicon glyphicon-exclamation-sign' aria-hidden='true'/>
                    {this.state.degreeError}
                  </div>
                </div>

                <label htmlFor='inputEntranceYear' className='col-sm-4 col-md-4 control-label'>入学年份<span
                    className="error alert alert-danger">*</span></label>
                <div className='form-group'>
                  <div className='col-sm-4 col-md-4' onBlur={this.validate}>
                    {entranceYear}
                  </div>

                  <div className={'error alert alert-danger' + (this.state.entranceYearError === '' ? ' hide' : '')}
                       role='alert'>
                    <span className='glyphicon glyphicon-exclamation-sign' aria-hidden='true'/>
                    {this.state.entranceYearError}
                  </div>
                </div>

                <label htmlFor='inputChannel' className='col-sm-4 col-md-4 control-label'>信息渠道<span
                    className="error alert alert-danger">*</span></label>
                <div className='form-group'>
                  <div className="col-sm-4 col-md-4">
                    {this.state.channelsInfo.chooseChannels.map((item, index) => {
                      return (
                          <div key={index}>
                            <input type="checkBox" name="channel" className="channel"
                                   value={item.label}
                                   onChange={this.handleChooseChannelChange}/>
                            <label>{item.label}</label>
                          </div>
                      );
                    })}

                    <input type='text' className='form-control' id='otherChannel' placeholder='其他渠道'
                           ref={(ref) => {
                             this.otherChannel = ref;
                           }}
                           onBlur={this.handleOtherChannelChange}/>

                  </div>
                </div>

                <div className='form-group'>
                  <div className='col-sm-offset-4 col-sm-4 col-md-offset-4 col-md-4'>
                    <button type='submit' disabled={this.getDisabled()} className='btn btn-success'>保存</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
    );

  }
});

ReactDOM.render(<ThridPartyUserDetail />, document.getElementById('thridParty-userDetail'));
