import {Component} from 'react';
import ButtonWrapper from '../common/ButtonWrapper';
import '../../style/paperList.less';

export default class TableHeader extends Component {
  handleClick() {
    this.props.onChangeModal();
  }

  render() {
    return (
      <div id='paperList-header'>
        <div className='header'>
          <div className='table-header'>
            {this.props.paperListTitle}
          </div>

          <div className='paperList-title'>

            <ButtonWrapper element='fa-plus bigger blue' text='新增试卷' operationButton={true}/>

            <ButtonWrapper element='fa-trash-o bigger red' text='批量删除' operationButton={this.props.operationButton}
                           onHandleClick={this.handleClick.bind(this)}/>
          </div>
        </div>
      </div>
    );
  }
}
