'use strict';

var Reflux = require('reflux');
var UserCenterActions = require('../../actions/user-center/user-center-actions');
var UserCenterStore = require('../../store/user-center/user-center-store');

var UserCenterGender = React.createClass({
  mixins: [Reflux.connect(UserCenterStore)],

  getInitialState: function () {
    return {
      gender: 'M',
      genderError: false
    };
  },
  componentDidUpdate: function (prevProps, prevState) {
    if (prevState.currentState !== this.state.currentState) {
      this.setState({
        gender: 'M',
        genderError: false
      });
    }
    if (this.state.gender === 'M') {
      this.refs.male.checked = true;
    } else {
      this.refs.female.checked = true;
    }
  },
  genderChange: function () {
    var checked;

    if (this.refs.male.checked === true) {
      checked = 'M';
    } else {
      checked = 'F';
    }

    UserCenterActions.changeGender(checked);
    UserCenterActions.validateGender(this.state.genderError);
  },

  render: function () {
    var tags = [
      {genderName: 'male', label: '男'},
      {genderName: 'female', label: '女'}
    ];

    return (
      <div>
        <div className="col-sm-4 col-md-4">
          {tags.map((item, index) => {
            return (
              <div key={index} className="col-sm-3 col-md-3">
                <input type="radio" name="gender" className="gender" id={item.genderName}
                       onChange={this.genderChange} ref={item.genderName}/>
                <label htmlFor={item.genderName}>{item.label}</label>
              </div>
            );
          })}

        </div>
        <div className={'error alert alert-danger' + (this.state.genderError === true ? '' : ' hide')}
             role="alert">
          <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
          请选择性别
        </div>
      </div>
    );
  }
});

module.exports = UserCenterGender;
