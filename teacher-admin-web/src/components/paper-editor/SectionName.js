import {Component} from 'react';
import {Modal, Button} from 'react-bootstrap';
import '../../style/paper-edit.less';

export default class SectionName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      writable: false,
      showModal: 'hidden'
    };
  }

  componentDidUpdate() {
    this.title.value = this.props.title;
  }

  addTitle() {
    this.setState({
      writable: false
    });
    this.props.onAddTitle(this.title.value, this.props.sectionIndex);
    this.props.editPaper({hasUnsavedChanges: true});
  }

  editTitle() {
    this.setState({
      writable: true
    });
  }

  closeBody() {
    this.setState({
      showModal: ''
    });
  }

  cancelButton() {
    this.setState({
      showModal: 'hidden'
    });
  }

  confirmButton() {
    this.props.onDeleteSection(this.props.sectionIndex);
    this.props.editPaper({hasUnsavedChanges: true});
    this.setState({
      showModal: 'hidden'
    });
  }

  editorName() {
    this.props.isDistributed ? '' : this.editTitle.bind(this);
  }

  closeHomework() {
    this.props.isDistributed ? '' : this.closeBody.bind(this);
  }

  render() {
    return (
      <div>
        <div className=' section-border  section-header row ' id='paper-section'>
          <div className='section-title col-sm-6 no-padding row'>
            <div className='col-sm-3 no-padding ' disabled={this.props.isDistributed}>
              <input type='text'
                     ref={(ref) => {
                       this.title = ref;
                     }}
                     disabled={this.props.isDistributed}
                     defaultValue={this.props.title}
                     className={this.state.writable ? 'input-header form-control' : 'input-header form-control read-only'}
                     readOnly={this.state.writable ? '' : 'readOnly'}
                     onBlur={this.state.writable ? this.addTitle.bind(this) : ''}
              />
            </div>
            <div className='col-sm-1 icon'>
              <i className={this.state.writable ? 'hidden' : 'fa fa-pencil-square-o'}
                 onClick={this.editorName()}
                 disabled={this.props.isDistributed}>
              </i>
            </div>
          </div>

          <div className='section-toolbar' disabled={this.props.isDistributed}>
            <a href='#'>
              <i className='fa fa-trash-o white' disabled={this.props.isDistributed}
                 onClick={this.closeHomework()}> </i>
            </a>
          </div>
        </div>

        <div className={this.state.showModal}>
          <div className='static-modal'>
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Title>删除提示</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                您确定要删除吗？
              </Modal.Body>

              <Modal.Footer>
                <Button onClick={this.cancelButton.bind(this)}>取消</Button>
                <Button bsStyle='primary' onClick={this.confirmButton.bind(this)}>确定</Button>
              </Modal.Footer>

            </Modal.Dialog>
          </div>
        </div>
      </div>

    );
  }
}
