'use strict';

var Paper = React.createClass({
  getInitialState(){
    return {
      paperName: this.props.item.paperName || 'PaperNamePaperName',
      isMarked: this.props.item.isMarked,
      isPublished: this.props.item.isPublished,
      sectionNumber: this.props.item.sectionNumber || 10,
      publishedNumber: this.props.item.publishedNumber || 1,
      role: this.props.item.role || '2',
      isFinished: this.props.item.isFinished
    }
  },
  render: function () {
    return (
      <div className="paper-button col-xs-12 col-md-12 col-sm-12">
        <h3 className="paper-name col-xs-9">
          {this.state.paperName}
        </h3>
        <div className="col-xs-3">
          <i className={"fa fa-2x" + (this.state.isMarked ? ' fa-star' : ' fa-star-o')}/>
        </div>
        <div className={"col-md-12" + (this.state.role === '1' ? '' : ' hide')}>
          <div className={this.state.isPublished ? 'hide' : ''}>未发布：
            <a href="#">点击发布</a>
          </div>
          <div className={this.state.isPublished ? '' : ' hide'}>已发布
          </div>
          <div>章节个数：{this.state.sectionNumber}</div>
          <div>已发布个数：{this.state.publishedNumber}</div>
        </div>
        <div className="button-bottom">
          <a href="#" className={"text-warning" + (this.state.role === '1' ? '' : ' unvisible')}><b>编辑</b></a>
          <a href="#" className={"text-info" + (this.state.role === '1' ? '' : ' unvisible')}><b>导出成绩</b></a>
          <a href="#" className={"text-success" + (this.state.isFinished ? ' unvisible' : '')}><b>开始答题</b></a>
        </div>
      </div>
    )
  }
});

module.exports = Paper;
