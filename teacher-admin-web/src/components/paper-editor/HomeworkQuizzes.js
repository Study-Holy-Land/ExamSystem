import {Component} from 'react';
import '../../style/paper-edit.less';
import HomeworkQuiz from '../../containers/paper-editor/HomeworkQuiz';

export default class HomeworkQuizzes extends Component {

  constructor(props) {
    super(props);
    this.moveCard = this.moveCard.bind(this);
    this.state = {
      homeworkQuizzes: this.props.homeworkQuizzes || []
    };
  }

  moveCard(dragIndex, hoverIndex) {
    this.props.onSortHomeworkQuizzes(this.state, dragIndex, hoverIndex, this.props.sectionIndex);
    this.props.editPaper({hasUnsavedChanges: true});
  }

  render() {
    const {homeworkQuizzes = [], sectionIndex} = this.props;
    return (
      <div>
        {
          homeworkQuizzes.map((item, index) => {
            const data = Object.assign({}, item, {
              sectionIndex,
              homeworkQuizIndex: index
            });
            return (
              <HomeworkQuiz key={index}{...data}
                            index={index}
                            id={item.id}
                            moveCard={this.moveCard}
                            isDistributed={this.props.isDistributed}
              />
            );
          })
        }
      </div>);
  }
}
