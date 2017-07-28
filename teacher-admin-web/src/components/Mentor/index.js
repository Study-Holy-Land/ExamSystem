import {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import superagent from 'superagent';
import noCache from 'superagent-no-cache';
import '../../style/mentor.less';
import TableHeader from './TableHeader';
import StudentList from './StudentList';
import TableFooter from './TableFooter';

class Mentor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      studentList: {}
    };
  }

  componentDidMount() {
    let page = parseInt(this.props.uri.query.page) || 1;
    superagent.get(API_PREFIX + '/students')
      .use(noCache)
      .query({
        page,
        pageCount: 15
      })
      .end((err, res) => {
        if (err) {
          throw err;
        } else {
          this.setState({studentList: res.body});
        }
      });
  }

  getPaperList(newList) {
    this.setState({
      studentList: newList
    });
  }

  render() {
    return (
      <div>
        <TableHeader/>
        <StudentList studentList={this.state.studentList}/>
        <TableFooter onGetPaperList={this.getPaperList.bind(this)} totalPage={this.state.studentList.totalPage}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => state;

export default connect(mapStateToProps)(withRouter(Mentor));
