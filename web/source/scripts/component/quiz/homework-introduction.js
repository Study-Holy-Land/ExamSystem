import {Component} from 'react';
const marked = require('marked');

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

class HomeworkIntroduction extends Component {
  render () {
    const desc = this.props.desc || '';

    function getMarkedDescArray (desc) {
      const reg = /<iframe (.*)><\/iframe>/g;
      const video = desc.match(reg) || [];
      const descArray = desc.split(reg);
      return {video, descArray};
    }

    function getDesc () {
      if (desc) {
        const result = getMarkedDescArray(desc);
        const markedDescArray = result.descArray.map(des => (marked(des)));
        return {__html: `${markedDescArray[0] || ''} ${result.video[0] || ''} ${markedDescArray[2] || ''}`};
      }
    }

    return (
      <div className='tab'>
        <div ref='container' className='content'>
          <div id='introduction' dangerouslySetInnerHTML={getDesc()} />
        </div>
      </div>
    );
  }
}

export default HomeworkIntroduction;
