import moment from 'moment';
import constant from '../../mixin/constant';

moment.locale('en', {
  longDateFormat: {
    l: 'YYYY-MM-DD'
  }
});

export default (time) => {
  return moment(new Date(parseInt(time) * constant.time.MILLISECOND_PER_SECONDS)).format('l');
};
