'use strict';

var Table = React.createClass({
  getInitialState: function () {
    return {
      tableList: [
        {
          firstName: 'Mark',
          lastName: 'Otto',
          userName: '@mdo'
        }, {
          firstName: 'Jacob',
          lastName: 'Thornton',
          userName: '@fat'
        },
        {
          firstName: 'Larry',
          lastName: 'the Bird',
          userName: '@twitter'
        }
      ]
    }
  },
  render: function () {
    var tableList = this.state.tableList;
    var list = tableList.map((item, index) => {
      return (
        <tr key={index}>
          <th scope="row">{index + 1}</th>
          <td>{item.firstName}</td>
          <td>{item.lastName}</td>
          <td>{item.userName}</td>
        </tr>
      )
    });
    return (
      <table className="table table-hover">
        <thead>
        <tr>
          <th>#</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Username</th>
        </tr>
        </thead>
        <tbody>
        {list}
        </tbody>
      </table>
    )
  }
});

module.exports = Table;