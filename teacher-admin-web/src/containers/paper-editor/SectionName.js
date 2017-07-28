import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import SectionName from '../../components/paper-editor/SectionName';

const mapDispatchToProps = (dispatch) => {
  return {
    onAddTitle: (sectionName, sectionIndex) => {
      let data = {sectionName, sectionIndex};
      dispatch({type: 'EDIT_SECTION_NAME', data});
    },
    onDeleteSection: (data) => {
      dispatch({type: 'DELETE_SECTION', data});
    },
    editPaper: (data) => {
      dispatch({type: 'EDIT_PAPER', data});
    }
  };
};

export default connect(() => {
  return {};
}, mapDispatchToProps)(withRouter(SectionName));
