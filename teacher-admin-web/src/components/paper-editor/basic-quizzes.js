import {Component} from 'react';
import '../../style/paper-edit.less';
import BasicQuiz from '../../containers/paper-editor/basic-quiz';

class BasicQuizzes extends Component {
  constructor(props) {
    super(props);
    this.moveCard = this.moveCard.bind(this);
    this.state = {
      basicQuizzes: this.props.basicQuizzes || []
    };
  }

  moveCard(dragIndex, hoverIndex) {
    this.props.sortBasicQuizzes(this.state, dragIndex, hoverIndex, this.props.sectionIndex);
  }

  render() {
    const {basicQuizzes, sectionIndex} = this.props;
    return (
      <div>
        {
          basicQuizzes.map((item, index) => {
            const data = Object.assign({}, item, {
              sectionIndex,
              basicQuizIndex: index
            });
            return (
              <BasicQuiz key={index} {...data}
                         index={index}
                         replaceBasicQuiz={this.props.replaceBasicQuiz}
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

export default BasicQuizzes;
