import moment from 'moment';

moment.locale('en', {
  longDateFormat: {
    l: 'DD/MM/YYYY'
  }
});

export default (time) => {
  return moment(new Date(time)).format('l');
};
