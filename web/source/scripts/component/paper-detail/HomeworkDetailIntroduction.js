import {Component} from 'react';
import {connect} from 'react-redux';

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

class HomeworkDetailIntrodution extends Component {

  render () {
    const desc = this.props.homeworkDetail ? this.props.homeworkDetail.desc : '';
    const reg = /<iframe (.*)><\/iframe>/g;

    function getDesc () {
      const video = desc.match(reg) || [];
      const descArray = desc.split(reg);
      const markedDescArray = descArray.map(des => (marked(des)));
      return {__html: `${markedDescArray[0] || ''} ${video[0] || ''} ${markedDescArray[2] || ''}`};
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

const mapStateToProps = ({paperDetail}) => {
  return {
    homeworkDetail: paperDetail.homeworkDetail
  };
};

const mapDispatchToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeworkDetailIntrodution);
