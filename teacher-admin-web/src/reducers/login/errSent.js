function errSent(state = {}, action) {
  switch (action.type) {
    case 'SEND_ERR': {
      return action.errMsg;
    }
  }
  return state;
}
export default errSent;
