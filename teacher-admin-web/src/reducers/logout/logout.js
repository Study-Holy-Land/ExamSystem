function logout(state = false, action) {
  switch (action.type) {
    case 'LOGOUT': {
      return true;
    }
    case 'RESET_LOGOUT':
      return false;
  }
  return state;
}

export default logout;
