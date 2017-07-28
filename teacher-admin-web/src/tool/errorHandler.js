import {cookie} from 'react-cookie-banner';
import {browserHistory} from 'react-router';

const errorHandler = (req) => {
  req.on('response', function(res) {
    if (res.statusCode === 401 || res.statusCode === 403) {
      cookie('authState', '', -1);
      cookie('authState', res.statusCode, 60 * 60 * 24, '/', '', true);
      browserHistory.replace(URI_PREFIX + '/login');
    }
  });
};

module.exports = errorHandler;
