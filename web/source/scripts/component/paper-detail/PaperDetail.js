import {Component} from 'react';
import {connect} from 'react-redux';
import superagent from 'superagent';
import errorHandler from '../../../../tools/error-handler.jsx';
import getQueryString from '../../../../tools/getQueryString';
import SectionIcon from './SectionIcon.js';
import SectionDetail from './SectionDetail';

require('../../../less/paper-list.less');
require('../../../less/get-account.less');
require('../../../less/quiz.less');

var Navigation = require('../../component/navigation/navigation.component.jsx');
var Account = require('../../component/reuse/get-account.component.jsx');

class PaperDetailForm extends Component {

  componentDidMount () {
    const programId = getQueryString('programId');
    const paperId = getQueryString('paperId');

    superagent.get(`${API_PREFIX}programs/${programId}/papers/${paperId}/sections`)
        .use(errorHandler)
        .end((err, res) => {
          if (err) {
            throw err;
          } else {
            this.props.editPaper({sections: res.body.data});
          }
        });
  }

  render () {
    return (
        <div id='paper'>
          <header>
            <Navigation>
              <Account />
            </Navigation>
          </header>

          <div id='paper-form'>
            <SectionIcon />
            <SectionDetail />
          </div>
        </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    editPaper: (data) => {
      dispatch({type: 'EDIT_PAPER', data});
    }
  };
};

export default connect(() => {
  return {};
}, mapDispatchToProps)(PaperDetailForm);
