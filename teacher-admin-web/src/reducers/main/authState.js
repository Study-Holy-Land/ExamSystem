import constant from '../../../mixin/constant';

export default (state = constant.httpCode.UNAUTHORIZED, action) => {
  switch (action.type) {
    case 'NO_USER':
      return action.authState;
    default:
      return state;
  }
};
