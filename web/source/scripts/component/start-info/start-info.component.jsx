'use strict';

var Reflux = require('reflux');
var page = require('page');

var StartInfo = React.createClass({

  start: function () {
    var url = 'logic-puzzle.html' + location.search;
    page(url);
  },

  render() {
    return (
      <div className="container-fluid">
        <section className="title">
          <p>逻辑题</p>
        </section>
        <section className="content">
          <div className="row">
            <div>一 答题需知</div>
          </div>
          <div className="row">
            <div>
              <ol>
                <li>
                  您共有90分钟时间，请认真答题
                </li>
                <li>
                  本套逻辑题共有12道小题，前2道参考例题
                </li>
                <li>
                  答题前，建议您先阅读例题
                </li>
                <li>
                  答题前，请确保网络条件畅通，无异常
                </li>
                <li>
                  答题前，请仔细阅读题目要求
                </li>
                <li>
                  请独立完成所有题目，禁止相互抄袭
                </li>
              </ol>
            </div>
          </div>
        </section>
        <section className="start-button">
          <button type="submit" className="btn btn-info btn-lg btn-block"
                  onClick={this.start}>开始
          </button>
        </section>
      </div>
    );
  }
});

module.exports = StartInfo;
