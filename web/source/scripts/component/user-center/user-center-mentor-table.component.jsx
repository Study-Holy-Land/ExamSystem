'use strict';

const stateData = {
  'AGREE_INVITATION': '已接受',
  'INVITATION': '已发送'
};

var MentorTableLine = React.createClass({
  render() {
    return (
      <tr key={this.props.index}>
        <td>{this.props.userName}</td>
        <td>{stateData[this.props.type]}</td>
      </tr>
    );
  }
});


var MentorTable = React.createClass({
  render() {
    var mentorList = this.props.mentorList || [];
    return (
      <div className="table-list text-center">
        <table className='table table-striped table-hover table-bordered'>
          <thead>
          <tr className="table-head">
            <td>姓名</td>
            <td>状态</td>
          </tr>
          </thead>
          <tbody>
          {
            mentorList.map((item, index) => {
              if (item.type !== 'DISAGREE_INVITATION') {
                return (
                  <MentorTableLine key={index} index={index} {...item}/>
                )
              }
            })
          }
          </tbody>
        </table>
      </div>
    );
  }
});

module.exports = MentorTable;
