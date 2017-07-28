'use strict';
import '../../../less/user-center.less';
var UserCenterStore = require('../../store/user-center/user-center-store');
var MessageManagementStore = require('../../store/user-center/message-management-store');
var Reflux = require('reflux');

var MessageTabs = React.createClass({
  mixins: [Reflux.connect(UserCenterStore), Reflux.connect(MessageManagementStore)],

  render: function () {
    return (
        <div className='tab-ul'>
          <ul id='myTab' className='myTab nav nav-tabs'>
                    <li className='active'>
                      <a href='#'>
                        <div className='font-color'>
                          <i className='fa fa-bell'></i>消息列表
                        </div>
                      </a>
                    </li>
          </ul>
        </div>
    );
  }
});

module.exports = MessageTabs;