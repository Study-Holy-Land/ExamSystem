function isJumped(state = false, action) {
  switch (action.type) {
    case 'JUMP_PAGE':
      return true;
  }
  return state;
}

export default isJumped;
