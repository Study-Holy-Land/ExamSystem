export default (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_URI': {
      return action.uri;
    }
  }
  return state;
};
