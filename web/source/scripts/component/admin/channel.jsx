'use strict';

var Reflux = require('reflux');
var ChannelAction = require('../../actions/admin/channel-actions');
var ChannelStore = require('../../store/admin/channel-store');
var constraint = require('../../../../mixin/register-constraint');

var Channel = React.createClass({
  mixins: [Reflux.connect(ChannelStore)],

  getInitialState: function () {
    return {
      links: []
    };
  },

  componentDidMount: function () {
    ChannelAction.getLinks();
  },

  componentDidUpdate: function () {
  },

  handleAddClick: function () {
    var channelName = this.refs.channel.value;

    ChannelAction.addLink({
      name: channelName
    }, this.state.links)
  },

  handleDeleteClick: function (evt) {
    var deleteIndex = evt.target.id;
    ChannelAction.deleteLink({
      name: this.state.links[deleteIndex].name,
      _id: this.state.links[deleteIndex]._id
    }, this.state.links, deleteIndex)
  },

  render: function () {
    var linksHtml = this.state.links.map((link, index) => {
      if (link.delete === true) {
        return (
          <tr key={index}>
            <td className="drop-little">
              <span>{link.name}</span>
            </td>
            <td className="drop-little">
              <span>{'http://academy.thoughtworkschina.com?channel=' + link._id}</span>
            </td>
            <td>
              <span id={index}>已删除</span>
            </td>
          </tr>
        );
      } else {
        return (
          <tr key={index}>
            <td className="drop-little">
              <span>{link.name}</span>
            </td>
            <td className="drop-little">
              <span>{'http://academy.thoughtworkschina.com?channel=' + link._id}</span>
            </td>
            <td>
              <i id={index} onClick={this.handleDeleteClick}>删除</i>
            </td>
          </tr>
        );
      }
    });

    return (
      <div>
        <div className="page-header">
          <h3>管理渠道</h3>
          <hr/>
        </div>
        <table className="table table-hover">
          <thead>
          <tr>
            <th>渠道名称</th>
            <th>专属URI</th>
            <th>对应操作</th>
          </tr>
          </thead>
          <tbody>
          {linksHtml}
          <tr>
            <td colSpan="2">
              <input ref="channel" type="text" className="form-control"/>
            </td>
            <td>
              <i onClick={this.handleAddClick}>增加</i>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    );
  }
});

module.exports = Channel;
