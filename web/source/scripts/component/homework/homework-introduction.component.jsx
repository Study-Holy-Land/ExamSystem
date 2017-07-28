'use strict';
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

var HomeworkIntroduction = React.createClass({

  componentWillUpdate: function (prev) {
    if (this.props.quiz.id !== prev.quiz.id) {
      this.refs.container.scrollTop = 0;
    }
  },

  render() {
    var desc = this.props.quiz.desc || "";
    function content() {
      var reg = /<iframe (.*)><\/iframe>/g;
      var video = desc.match(reg) || [];
      var descArray = desc.split(reg);
      var markedDescArray = descArray.map(des=>(marked(des)));
      return {__html:`${markedDescArray[0] || ''} ${video[0] || ''} ${markedDescArray[2] || ''}`};
    }

    return (
      <div className="tab">
        <div ref="container" className="content">
          <div id="introduction" dangerouslySetInnerHTML={content()}>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = HomeworkIntroduction;
