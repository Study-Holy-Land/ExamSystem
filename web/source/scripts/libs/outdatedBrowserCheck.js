var $ = require('jquery');
$('body').append("<div id='outdated'>");

var outdatedBrowserRework = require("outdated-browser-rework");
require("./outdatedbrowser.min.css");
outdatedBrowserRework({
  browserSupport: {
    'Chrome': 48, // Includes Chrome for mobile devices
    'IE': 11,
    'Safari': 7,
    'Mobile Safari': 7,
    'Firefox': 32
  }
});
