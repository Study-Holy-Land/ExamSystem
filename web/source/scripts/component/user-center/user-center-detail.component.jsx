'use strict';

var Input = require('react-bootstrap/lib/Input');
var UserCenterActions = require('../../actions/user-center/user-center-actions');
var UserCenterStore = require('../../store/user-center/user-center-store');
var Reflux = require('reflux');
var ReactToastr = require('react-toastr');
var validate = require('validate.js');
var constraint = require('../../../../mixin/user-detail-constraint');
var constant = require('../../../../mixin/constant');
var getError = require('../../../../mixin/get-error');
var moment = require('moment');

var {ToastContainer} = ReactToastr;
var ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);

var $ = jQuery;
require('../../libs/jquery.cxselect.js');
var data = require('../../libs/cityData.js');

const hashArray = window.location.hash.split('?');
const currentHash = hashArray[0].substr(1);

var UserDetail = React.createClass({
  mixins: [Reflux.connect(UserCenterStore)],

  getInitialState: function () {
    return {
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
      schoolProvinceError: '',
      schoolCityError: '',
      nameError: '',
      emailError: '',
      mobilePhoneError: '',
      majorError: '',
      degreeError: '',
      entranceYearError: '',
      currentState: currentHash,
      channel: [],
      channelsInfo: {otherChannel: '', chooseChannels: []}
    };
  },

  componentDidUpdate: function (prevProps, prevState) {
    if (prevState.currentState !== this.state.currentState) {
      this.setState({
        school: '',
        schoolError: '',
        name: '',
        nameError: '',
        major: '',
        majorError: '',
        gender: 'M',
        degree: '',
        degreeError: '',
        schoolProvince: '',
        schoolCity: '',
        schoolProvinceError: '',
        schoolCityError: '',
        entranceYear: '',
        entranceYearError: ''
      });
    }
    if (prevState.schoolProvince !== '' && prevState.schoolProvince !== this.state.schoolProvince) {
      this.setState({
        schoolCity: ''
      })
    }
    this.otherChannel.value = this.state.channelsInfo.otherChannel;
  },

  showAlert: function (textInfo) {
    this.container[textInfo.result](
      textInfo.success,
      textInfo.text, {
        timeOut: 3000,
        extendedTimeOut: 1000,
        showAnimation: 'animated bounceIn',
        hideAnimation: 'animated bounceOut'
      });
  },

  componentDidMount: function () {
    const addProgramStatus = window.location.href.split('?addProgram=')[1];

    if (addProgramStatus) {
      if (addProgramStatus === '1') {
        this.showAlert({text: '加入program', success: '成功！', result: 'success'});
      }
      if (addProgramStatus === '2') {
        this.showAlert({text: '该program不存在！', success: '', result: 'error'});
      }
      if (addProgramStatus === '3') {
        this.showAlert({text: '邀请码已失效,加入program失败！', success: '', result: 'error'});
      }
      window.location.hash = '#userDetail';
    }

    UserCenterActions.loadUserDetail();
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

  checkInfo: function () {
    var school = {school: this.state.school};
    var name = {name: this.state.name};
    var major = {major: this.state.major};
    var degree = {degree: this.state.degree};
    var schoolProvince = {schoolProvince: this.state.schoolProvince};
    var schoolCity = {schoolCity: this.state.schoolCity};
    var entranceYear = {entranceYear: this.state.entranceYear};

    var userInfo = [];

    userInfo.push(school, name, major, degree, schoolProvince, schoolCity, entranceYear);
    var pass = false;
    var stateObj = {};

    userInfo.forEach((item) => {
      var result = validate(item, constraint);
      var error = getError(result, Object.keys(item));

      if (error !== '') {
        pass = true;
      }
      stateObj[Object.keys(item) + 'Error'] = error;

      this.setState(stateObj);
    });
    return pass;
  },

  update: function (evt) {
    evt.preventDefault();
    UserCenterActions.checkGender(this.state.gender);
    const channel = this.integrateChannel();
    var userData = {
      school: this.state.school,
      name: this.state.name,
      gender: this.state.gender,
      major: this.state.major,
      degree: this.state.degree,
      schoolProvince: this.state.schoolProvince,
      schoolCity: this.state.schoolCity,
      entranceYear: this.state.entranceYear,
      channel: channel
    };

    if (this.checkInfo()) {
      return;
    } else if (this.state.gender === '') {
      return;
    }

    UserCenterActions.updateUserDetail(userData);
  },

  hiddenErrorMessage(err) {
    var errObj = {};
    errObj[err] = '';
    this.setState(errObj);
  },

  integrateChannel() {
    let channel = this.state.channelsInfo.chooseChannels.filter(item => item.isChecked === true)
      .map(item => item.label);
    if (this.state.channelsInfo.otherChannel) {
      channel = channel.concat(this.state.channelsInfo.otherChannel);
    }
    return channel;
  },

  handleOtherChannelChange(e){
    const otherChannel = e.target.value;
    if (otherChannel !== this.state.channelsInfo.otherChannel) {
      UserCenterActions.changeChannelsInfo({
        chooseChannels: this.state.channelsInfo.chooseChannels,
        otherChannel
      });
    }
  },

  handleChooseChannelChange(e){

    const isChecked = e.target.checked;
    const label = e.target.value;

    let chooseChannels = this.state.channelsInfo.chooseChannels.map(item => {
      item.isChecked = item.label === label ? isChecked : item.isChecked;
      return item;
    });

    UserCenterActions.changeChannelsInfo({
      chooseChannels,
      otherChannel: this.state.channelsInfo.otherChannel
    });
  },

  render: function () {
    var classString = (this.state.currentState === 'userDetail' ? '' : '  hidden');
    var endEntranceYear = moment.unix(new Date() / constant.time.MILLISECOND_PER_SECONDS).format('YYYY');

    var indents = [];
    for (var i = 0; i < 12; i++) {
      indents.push(<option key={i} value={endEntranceYear - i}>{endEntranceYear - i}</option>);
    }

    var entranceYear =
      <select ref='entranceYear' placeholder='入学年份' name='entranceYear' value={this.state.entranceYear}
              onChange={this.handleChange}
              className={'form-control' + (this.state.entranceYearError === '' ? '' : ' select')}
              onFocus={this.hiddenErrorMessage.bind(this, 'entranceYearError')}>

        <option value=''>请选择</option>
        {indents}
      </select>;

    return (
      <div>
        <div className={'col-md-10 col-sm-10 col-xs-12 content-padding' + classString}>
          <div className='content'>

            <ToastContainer ref={(ref) => {
              this.container = ref;
            }}
                            toastMessageFactory={ToastMessageFactory}
                            className='toast-center text-center col-sm-4'/>

            <form className='form-horizontal form-top-height' onSubmit={this.update}
                  action='user-center.html#userDetail'>
              <div id='account-info'>
                <label htmlFor='inputSchool' className='col-sm-4 col-md-4 control-label'>学校<span
                  className="error alert alert-danger">*</span></label>
                <div className={'form-group has-' + (this.state.schoolError === '' ? '' : 'error')}>
                  <div className='col-sm-4 col-md-4'>
                    <input type='text' className='form-control' id='inputSchool' aria-describedby='helpBlock2'
                           placeholder='学校'
                           onChange={this.handleChange} ref='school' name='school' value={this.state.school}
                           onBlur={this.validate} onFocus={this.hiddenErrorMessage.bind(this, 'schoolError')}/>
                  </div>
                  <div className={'error alert alert-danger' + (this.state.schoolError === '' ? ' hidden' : '')}
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
                        value={this.state.schoolProvince} onChange={this.handleChange}
                        onFocus={this.hiddenErrorMessage.bind(this, 'schoolProvinceError')}/>
                    </div>
                    <div className="col-md-6 col-xs-6">
                      <select className={"form-control city" + (this.state.schoolCityError === '' ? '' : ' select')}
                              name="schoolCity"
                              value={this.state.schoolCity} onChange={this.handleChange}
                              onFocus={this.hiddenErrorMessage.bind(this, 'schoolCityError')}/>
                    </div>
                  </div>
                  <div
                    className={'error alert alert-danger' + (this.state.schoolProvinceError === '' && this.state.schoolCityError === '' ? ' hidden' : '')}
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
                           onBlur={this.validate} onFocus={this.hiddenErrorMessage.bind(this, 'nameError')}/>
                  </div>
                  <div className={'error alert alert-danger' + (this.state.nameError === '' ? ' hidden' : '')}
                       role='alert'>
                    <span className='glyphicon glyphicon-exclamation-sign' aria-hidden='true'/>
                    {this.state.nameError}
                  </div>
                </div>

                <label htmlFor='inputMobilePhone' className='col-sm-4 col-md-4 control-label'>手机<span
                  className="error alert alert-success">*</span></label>
                <div className='form-group'>
                  <div className='col-sm-4 col-md-4'>
                    <input type='text' className='form-control' id='inputMobilePhone' placeholder='手机'
                           disabled="disabled" value={this.state.mobilePhone}/>
                  </div>
                </div>

                <label htmlFor='inputEmail' className='col-sm-4 col-md-4 control-label'>邮箱<span
                  className="error alert alert-success">*</span></label>
                <div className='form-group'>
                  <div className='col-sm-4 col-md-4'>
                    <input type='text' className='form-control' id='inputEmail' placeholder='邮箱'
                           disabled="disabled" value={this.state.email}/>
                  </div>
                </div>

                <label htmlFor='inputGender' className='col-sm-4 col-md-4 control-label'>性别<span
                  className="error alert alert-danger">*</span></label>
                <div className='form-group'>
                  {this.props.children}
                </div>

                <label htmlFor='inputMajor' className='col-sm-4 col-md-4 control-label'>专业<span
                  className="error alert alert-danger">*</span></label>
                <div className={'form-group has-' + (this.state.majorError === '' ? '' : 'error')}>
                  <div className='col-sm-4 col-md-4'>
                    <input type='text' className='form-control' id='inputMajor' aria-describedby='helpBlock2'
                           placeholder='专业'
                           onChange={this.handleChange} name='major' ref='major' value={this.state.major}
                           onBlur={this.validate} onFocus={this.hiddenErrorMessage.bind(this, 'majorError')}/>
                  </div>
                  <div className={'error alert alert-danger' + (this.state.majorError === '' ? ' hidden' : '')}
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
                            className={'form-control' + (this.state.degreeError === '' ? '' : ' select')}
                            onFocus={this.hiddenErrorMessage.bind(this, 'degreeError')}>
                      <option value=''>请选择</option>
                      <option value='专科'>专科及以下</option>
                      <option value='本科'>本科</option>
                      <option value='硕士'>硕士</option>
                      <option value='博士'>博士</option>
                    </select>
                  </div>

                  <div className={'error alert alert-danger' + (this.state.degreeError === '' ? ' hidden' : '')}
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

                  <div className={'error alert alert-danger' + (this.state.entranceYearError === '' ? ' hidden' : '')}
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
                                 checked={item.isChecked}
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
                    <button type='submit' className='btn btn-default btn-info'>保存</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );

  }
});

module.exports = UserDetail;
