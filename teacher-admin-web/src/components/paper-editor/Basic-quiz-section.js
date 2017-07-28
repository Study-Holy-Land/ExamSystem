import {Component} from 'react';
import SectionName from '../../containers/paper-editor/SectionName';
import '../../style/paper-edit.less';
import QuizAddButton from './basic-quiz-add-button';
import BasicQuizzes from '../../containers/basic-quiz/sort-basic-quizzes';
import {DropTarget, DragSource} from 'react-dnd';
import flow from 'lodash/flow';
import {findDOMNode} from 'react-dom';

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
    if (dragIndex === hoverIndex) {
      return;
    }

    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    const clientOffset = monitor.getClientOffset();

    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    props.moveCard(dragIndex, hoverIndex);

    monitor.getItem().index = hoverIndex;
  }
};

class BasicQuizSection extends Component {

  handleToggleSection(sectionToggle) {
    this.setState({sectionStatus: sectionToggle});
  }

  render() {
    const {isDragging, connectDragSource, connectDropTarget} = this.props;
    const opacity = isDragging ? 0 : 1;

    return connectDragSource(
      connectDropTarget(<div className='col-sm-offset-1 col-sm-10' style={{opacity}}>
        <SectionName title={this.props.title} sectionIndex={this.props.index}
                     onToggleSction={this.handleToggleSection.bind(this)}
                     isDistributed={this.props.isDistributed}/>
        <div className='homework-border row'>
          <BasicQuizzes basicQuizzes={this.props.quizzes} sectionIndex={this.props.index}
                        replaceBasicQuiz={this.props.replaceBasicQuiz}
                        isDistributed={this.props.isDistributed}/>
          <QuizAddButton sectionIndex={this.props.index} updateState={this.props.updateState}
                         isDistributed={this.props.isDistributed}/>
        </div>
      </div>)
    );
  }
}

export default flow(DropTarget('section', cardTarget, connect => ({
  connectDropTarget: connect.dropTarget()
})), DragSource('section', cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
})))(BasicQuizSection);
