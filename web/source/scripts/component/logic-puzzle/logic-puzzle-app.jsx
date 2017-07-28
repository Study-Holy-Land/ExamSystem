'use strict';

var Reflux = require('reflux');
var LogicPuzzleStore = require('../../store/logic-puzzle/logic-puzzle-store');
var LogicPuzzleActions = require('../../actions/logic-puzzle/logic-puzzle-actions');
var Modal = require('react-bootstrap/lib/Modal');
var Button = require('react-bootstrap/lib/Button');
var getQueryString = require('../../../../tools/getQueryString');

var LogicPuzzle = React.createClass({
  mixins: [Reflux.connect(LogicPuzzleStore)],

  getInitialState: function () {
    return {
      showModal: false
    };
  },

  componentDidMount: function () {
    var id = getQueryString('sectionId');
    LogicPuzzleActions.loadItem(id);
  },

  render: function () {
    let programId = this.state.programId || '';
    let paperId = this.state.paperId || '';


    return (

      <div className="container-fluid">
        <div className="row">
          {this.props.children}
          <Modal
            show={this.state.showModal}
            dialogClassName="custom-modal"
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-lg">提示:</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              时间到,已提交.
            </Modal.Body>
            <Modal.Footer>
              <Button href={`dashboard.html?programId=${programId}&paperId=${paperId}`}>确定</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  }
});

module.exports = LogicPuzzle;
