import {Component} from 'react';
import superagent from 'superagent';
import {findDOMNode} from 'react-dom';
import {DragSource, DropTarget} from 'react-dnd';
import flow from 'lodash/flow';
import '../../style/paper-edit.less';
let ItemTypes = {CARD: 'card'};

const quizType = {
  'BASIC_BLANK_QUIZ': '填空题',
  'SINGLE_CHOICE': '单选题',
  'MULTIPLE_CHOICE': '多选题'
};

const basicsType = {
  'basicBlankQuizzes': 'basic-blank-quizzes',
  'singleChoices': 'single-choices',
  'multipleChoices': 'multiple-choices'
};

const cardSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index
    };
  }
};

const cardTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // Time to actually perform the action
    props.moveCard(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  }
};

class BasicQuiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      basicQuiz: {}
    };
  }

  receiveBasicQuiz(uri) {
    const uriArray = uri.split('/');
    superagent
      .get(API_PREFIX + `/${basicsType[uriArray[0]]}/${uriArray[1]}`)
      .end((err, res) => {
        if (err) {
          throw (err);
        }
        this.setState({
          basicQuiz: res.body
        });
      });
  }

  componentDidMount() {
    this.receiveBasicQuiz(this.props.uri);
  }

  componentWillReceiveProps(next) {
    this.receiveBasicQuiz(next.uri);
  }

  removeHomeworkQuiz(sectionIndex, homeworkQuizIndex) {
    const data = {sectionIndex, homeworkQuizIndex};
    this.props.onRemoveHomeworkQuiz(data);
    this.props.editPaper({hasUnsavedChanges: true});
  }

  replaceBasicQuiz(sectionIndex, homeworkQuizIndex) {
    const uri = this.props.uri;
    const data = {sectionIndex, homeworkQuizIndex, uri};
    this.props.replaceBasicQuiz(data);
    this.props.editPaper({hasUnsavedChanges: true});
  }

  render() {
    const {connectDragSource, connectDropTarget} = this.props;
    return connectDragSource(connectDropTarget(
      <div className='col-md-2 col-xs-4 padding-width'>
        <div className='homework-title'>
          <div className='title-style'>
            <h5 className='title-header no-margin'>
              {this.state.basicQuiz.description}
            </h5>
          </div>
          <div className='homework-type'>
            <span>{quizType[this.state.basicQuiz.type]}</span>
          </div>
          <div className='fa-icon pull-right'>
            <i className='fa fa-cog'
               onClick={this.props.isDistributed ? '' : this.replaceBasicQuiz.bind(this, this.props.sectionIndex, this.props.basicQuizIndex)}></i>
            <i className='fa fa-trash-o'
               onClick={this.props.isDistributed ? '' : this.removeHomeworkQuiz.bind(this, this.props.sectionIndex, this.props.basicQuizIndex)}> </i>
          </div>
        </div>
      </div>
    ));
  }
}
;

export default flow(
  DropTarget(ItemTypes.CARD, cardTarget, connect => ({
    connectDropTarget: connect.dropTarget()
  })),
  DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }))
)(BasicQuiz);

