import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import SectionList from '../../components/paper-editor/SectionList';

const mapStateToProps = ({paperInfo}) => {
  let sections;

  if (paperInfo.sections) {
    sections = paperInfo.sections.filter(section => section.type !== 'logicQuiz');
  }
  return {sections};
};

const mapDispatchToProps = (dispatch) => {
  return {
    sortSections: (dragIndex, hoverIndex) => {
      let data = {dragIndex, hoverIndex};
      dispatch({type: 'SORT_SECTIONS', data});
    },
    editPaper: (data) => {
      dispatch({type: 'EDIT_PAPER', data});
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SectionList));
