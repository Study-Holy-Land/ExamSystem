import {Component} from 'react';
import superagent from 'superagent';
import noCache from 'superagent-no-cache';
import errorHandler from '../../tool/errorHandler';
import Switch from 'react-bootstrap-switch';
import constant from '../../../mixin/constant';
import {PaginationWrapper} from '../common';

export default class CheManagementBoy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
      switchValue: [],
      isSpinnerRelease: []
    };
  }

  componentDidMount() {
    superagent.get(API_PREFIX + '/che')
      .use(noCache)
      .use(errorHandler)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        const userChe = res.body.map((user) => user.che);

        this.setState({
          userList: res.body,
          switchValue: userChe
        });
      });
  }

  createChe(email, callback) {
    superagent.post(API_PREFIX + '/che')
      .send({email})
      .end((err, res) => {
        if (err) {
          throw err;
        }
        callback({status: res.statusCode});
      });
  }

  delete(email, callback) {
    superagent.delete(API_PREFIX + '/che')
      .send({email})
      .use(noCache)
      .use(errorHandler)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        callback(res.statusCode);
      });
  }

  handleChange(index, email) {
    let switchArr = this.state.switchValue;
    let isSpinnerReleaseArr = this.state.isSpinnerRelease;
    isSpinnerReleaseArr[index] = !isSpinnerReleaseArr[index];
    this.setState({
      isSpinnerRelease: isSpinnerReleaseArr
    });
    if (!this.state.switchValue[index]) {
      this.createChe(email, (result) => {
        if (result.status === constant.httpCode.CREATED) {
          switchArr[index] = !switchArr[index];
          isSpinnerReleaseArr[index] = !isSpinnerReleaseArr[index];
          this.setState({
            switchValue: switchArr,
            isSpinnerRelease: isSpinnerReleaseArr
          });
        }
      });
    } else {
      this.delete(email, (result) => {
        if (result === constant.httpCode.NO_CONTENT) {
          switchArr[index] = !switchArr[index];
          isSpinnerReleaseArr[index] = !isSpinnerReleaseArr[index];
          this.setState({switchValue: switchArr, isSpinnerRelease: isSpinnerReleaseArr});
        }
      });
    }
  }

  judgeRelease(index) {
    return this.state.isSpinnerRelease[index] ? 'fa fa-spinner fa-spin' : '';
  }

  render() {
    return (
      <div className='che-management-body'>
        <div className='users-table'>
          <table className='table table-bordered table-striped table-hover'>
            <thead>
            <tr>
              <th>姓名</th>
              <th>邮箱</th>
              <th>Che</th>
            </tr>
            </thead>
            <tbody className='table-body'>
            {
              this.state.userList.map(({user}, index) => {
                const switchValue = this.state.switchValue[index] === true ? this.state.switchValue[index] : false;
                const disabled = this.state.isSpinnerRelease[index] === true;
                const isWaitting = this.state.isSpinnerRelease[index] ? 'fa fa-spinner fa-spin' : '';
                return (
                  <tr key={index}>
                    <th>{user.userName}</th>
                    <th>{user.email}</th>
                    <th>
                      <Switch value={switchValue} size='small' onColor='info' disabled={disabled}
                              onChange={this.handleChange.bind(this, index, user.email)}/>
                      <i className={isWaitting}> </i>
                    </th>
                  </tr>
                );
              })
            }
            </tbody>
          </table>
        </div>
        <div id='paperList-footer'>
          <div className='form-footer row'>
            <div className='col-xs-6 dataTable-pagination'>
              <PaginationWrapper totalPage={2} currentPage={1}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
