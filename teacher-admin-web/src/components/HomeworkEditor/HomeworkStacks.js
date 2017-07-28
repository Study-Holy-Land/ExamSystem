import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import request from 'superagent';

class HomeworkStacks extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      items: []
    };
  }

  onValueChange(e) {
    this.props.onValueChange(e.target.value);
  }

  componentDidMount() {
    request
      .get(API_PREFIX + '/stacks')
      .end((err, res) => {
        if (err) {
          throw err;
        }
        this.setState({
          items: res.body.items
        });
      });
  }

  render() {
    const stackList = (
      this.state.items.map(({stackId, title}, index) => {
        return <option key={index} value={stackId}>{title}</option>;
      })
    );

    return (
      <div className='row no-margin-left-right form-group'>
        <div className='col-sm-3 text-right'><label>技术栈</label></div>
        <div className='col-sm-6'>
          <select value={this.props.defaultStackId} className='form-control type-select' disabled={this.props.status === 1}
                  onChange={this.onValueChange.bind(this)}
          >
            {stackList}
          </select>

          <div className={'row no-margin-left-right warning' + (this.props.typeError ? '' : ' warning-hidden')}>
            <div className='col-xs-12'>
              <i className='fa fa-warning warning-icon'> </i>
              <span>{this.props.typeError}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

HomeworkStacks.propTypes = {
  onValueChange: React.PropTypes.func.isRequired,
  stackId: Number
};

export default connect(() => {
  return {};
})(withRouter(HomeworkStacks));
