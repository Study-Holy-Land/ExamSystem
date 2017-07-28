'use strict';

var Reflux = require('reflux');
var LogicPuzzleStore = require('../../store/logic-puzzle/logic-puzzle-store');

var $ = jQuery;
require('../../libs/jquery.elevatezoom.js');

var LogicPuzzleChart = React.createClass({
  mixins: [Reflux.connect(LogicPuzzleStore)],

  getInitialState: function () {
    return {
      item: {
        chartPath: ''
      }
    };
  },

  componentDidUpdate: function () {
    if ('' !== this.state.item.chartPath) {
      $('.zoomContainer').remove();
      $(this.refs.logicPuzzleImg)
        .removeData('zoomImage')
        .elevateZoom({
          zoomWindowFadeIn: 500,
          zoomWindowFadeOut: 500,
          lensFadeIn: 500,
          lensFadeOut: 500
        });
    }
  },

  render: function () {
    return (
      <div className="left-chart">
        <a className="left-chart-image" href={this.state.item.chartPath} data-lightbox="image">
          <img id="logic-puzzle-img" src={this.state.item.chartPath} data-zoom-image={this.state.item.chartPath}
               alt="逻辑题图片" ref="logicPuzzleImg"/>
          <i className="fa fa-search-plus magnifying-glass"/>
        </a>
      </div>
    );
  }
});

module.exports = LogicPuzzleChart;
