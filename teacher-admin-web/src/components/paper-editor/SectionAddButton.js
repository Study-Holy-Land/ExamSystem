import {Component} from 'react';
import '../../style/paper-edit.less';

const sectionType = [{
  text: '简单客观题',
  value: 'basicQuiz',
  defaultChecked: ''
}, {
  text: '编程题',
  value: 'homeworkQuiz',
  defaultChecked: 'defaultChecked'
}];

export default class SectionAddButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sectionType: 'homeworkQuiz'
    };
  }

  updateSectionType(event) {
    const sectionType = event.target.value;
    this.setState({
      sectionType
    });
  }

  showSection() {
    let section;
    if (this.state.sectionType === 'homeworkQuiz') {
      section = {quizzes: [], title: '编程题', type: 'homeworkQuiz'};
    } else {
      section = {quizzes: [], title: '简单客观题', type: 'basicQuiz'};
    }
    this.props.handleSectionList(section);
  }

  render() {
    return (
      <div id='paper-section'>
        <div className='col-sm-offset-1 col-sm-10'>
          <div className='add-section2'>
            <div className='section-type'>

              {
                sectionType.map(({text, value, defaultChecked}, index) => {
                  return (
                    <div className='col-sm-2' key={index}>
                      <input type='radio' value={value} name='sectionType'
                             defaultChecked={defaultChecked}
                             onClick={this.updateSectionType.bind(this)}/>
                      <label>{text}</label>
                    </div>
                  );
                })
              }

            </div>

            <div className='text-center'>
              <i className='fa fa-plus fa-small' onClick={this.showSection.bind(this)}> </i>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
