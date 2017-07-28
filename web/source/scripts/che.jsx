'use strict';

var Che = React.createClass({
  render: function () {
    const  cheUrl = location.href.split('=')[1];
    const width = screen.width;
    const height = screen.height;
    return (
        <div>
          <iframe src={cheUrl} frameborder="0" width={width} height={height}></iframe>
        </div>
    )
  }
});

ReactDom.render(<Che />, document.getElementById('che-container'));
