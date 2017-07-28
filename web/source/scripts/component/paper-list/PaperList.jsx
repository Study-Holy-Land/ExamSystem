require('font-awesome');
var Reflux = require('reflux');

let rateImagesPath = [];

for (let i = 0; i <= 10; i++) {
  var path = require(`../../../images/circle-rate/${i}.png`);
  rateImagesPath.push({path: path, key: i})
}

var PaperListAction = require('../../actions/paper-list/paper-list');
var PaperListStore = require('../../store/paper-list/paper-list');

var PaperList = React.createClass({

  mixins: [Reflux.connect(PaperListStore)],

  componentWillReceiveProps:function(){
    PaperListAction.loadPapers();
  },

  componentDidMount: function () {
    PaperListAction.loadPapers();
  },

  clickPaper: function (id, programId, currentQuizId, programType, operationType) {
    if (operationType === 'UNDISTRIBUTION') {
      return;
    }
    return () => {
      PaperListAction.getOnePaper(id, programId, currentQuizId, programType);
    }
  },

  getImagePath: function (rate) {
    const rateKey = parseInt(rate / 10);
    const imagePath = rateImagesPath.find(item => item.key === rateKey).path;
    return imagePath;
  },

  render: function () {
    var papers = this.state.papers || [];
    var programList = papers.map((program, programIndex) => {
      var icons = ['fa-coffee', 'fa-diamond', 'fa-code', 'fa-files-o', 'fa-cube'];

      return (
          <div key={programIndex}>
            <h4>
              <span className="fa fa-group"> </span>
              <span>{program.programName}</span>
            </h4>
            <div>
              <ul className="list row">
                {program.data.map((item, PaperIndex) => {
                  let itemIsEnable;
                  const isPractice = program.programType === "practice" && program.orderEnable === false;
                  var randomNumber = Math.floor(Math.random() * 5);
                  itemIsEnable = isPractice ? true : this.state.isClickedArray[programIndex] === item.id;
                  return (
                      <li
                          className={itemIsEnable ? 'list-item-enable col-sm-2' : 'list-item-disable col-sm-2'}
                          onClick={itemIsEnable ? this.clickPaper(item.id, item.programId, item.currentQuizId, program.programType, item.operationType) : ''}
                          key={PaperIndex}>

                        <div className='homework-title disabled-hover'>
                          <h4 className='title-header no-margin'>
                            <span className="paper-name-size">{item.paperName}</span>
                          </h4>
                          <div className="paper-rate">

                            <div className="rate-chart">
                              <img src={this.getImagePath(item.rate)} width="80px" height="80px"/>
                              <div className="paper-rate-text">
                                <span className="rate-number">{`${item.rate}%`}</span>
                                <p className="assist-text">完成度</p></div>
                            </div>

                            <div className="rate-data">
                              <div className="rate-data-content">
                                <div className="finished-background">
                                  <div className="finished-section"></div>
                                  <div className="finished-text">{item.finishedSection}&emsp;完成数量</div>
                                </div>
                                <div className="total-background">
                                  <div className="total-section"></div>
                                  <div className="finished-text">{item.totalSection}&emsp;模块总量</div>
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>

                        <div className={itemIsEnable ? 'hidden' : 'hover-text'}><p>当前试卷不可查看<br/>请顺序答题</p></div>
                      </li>
                  )
                })}
              </ul>
            </div>
          </div>)
    });

    return (
        <div>
          {programList}
        </div>
    )
  }
});

module.exports = PaperList;
