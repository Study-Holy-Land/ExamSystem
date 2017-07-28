import {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';

class ButtonWrapper extends Component {

  handleClick(text) {
    switch (text) {
      case '批量删除':
        this.props.onHandleClick();
        break;
      case '新增试卷':
        this.addPaper();
        break;
      case '新增试题':
        this.addPaper();
        break;
      case '确定':
        this.props.changeAuthority();
        break;
    }
  }

  addPaper() {
    this.props.router.push(this.props.uri.pathname + '/new');
  }

  render() {
    return (
      <button className='btn btn-default' disabled={this.props.operationButton ? '' : 'disabled'}
              onClick={this.handleClick.bind(this, this.props.text)}>
        <i className={'fa ' + this.props.element}> </i>
        <span className='text'>{this.props.text} </span>
      </button>
    );
  }
}

const mapStateToProps = (state) => state;

export default connect(mapStateToProps)(withRouter(ButtonWrapper));
