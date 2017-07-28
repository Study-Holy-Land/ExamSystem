'use strict';

require('../less/qa-page.less');
require('../less/get-account.less');

var marked = require('marked');
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
});

var Navigation = require('./component/navigation/navigation.component.jsx');
var Account = require('./component/reuse/get-account.component.jsx');
var constant = require('../../mixin/constant');
var Reflux = require('reflux');
var QAPageAction = require('./actions/qa-page/qa-page-actions');
var QAPageStore = require('./store/qa-page/qa-page-store');

var QAPage = React.createClass({
  mixins: [Reflux.connect(QAPageStore)],

  getInitialState: function () {
    return {
      qaContent: ''
    };
  },

  componentDidMount: function () {
    QAPageAction.loadQAContent();
  },

  render: function () {
    var desc = this.state.qaContent || "";

    function content() {
      var pattern = /a href=/g;
      desc = marked(desc);
      var addTargetInMarkDownText = desc.replace(pattern, "a target='_blank' href=");
      return {__html: addTargetInMarkDownText};
    }

    return (
      <div>
        <header>
          <Navigation>
            <Account state="index"/>
          </Navigation>
        </header>
        <div>
          <div className="content">
            <div id="QADescribe" className="container-fluid" dangerouslySetInnerHTML={content()}>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

ReactDom.render(<QAPage />, document.getElementById('QAContent'));
