'use strict';

var PageMachine = React.createClass({
  getInitialState: function () {
    return {
      pageList: [1, 2, 3, 4, 5]
    }
  },
  render: function () {
    var pageList = this.state.pageList;
    var list = pageList.map((item, index) => {
      return (
        <li key={index}>
          <a href="#">{item}</a>
        </li>
      )
    });

    return (
      <nav>
        <ul className="pagination">
          <li>
            <a href="#" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          {list}
          <li>
            <a href="#" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
    )
  }
});

module.exports = PageMachine;