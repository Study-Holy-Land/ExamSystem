var moment = require('moment');

moment.locale('en', {
  longDateFormat: {
    l: 'YYYY-MM-DD'
  }
});

module.exports = moment().format('l');//eslint-disable-line