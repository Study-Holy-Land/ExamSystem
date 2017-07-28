import {Component} from 'react';

class MessageTabs extends Component {
  render() {
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
}

export default MessageTabs;
