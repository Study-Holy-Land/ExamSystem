const stacks = (state = [], action) => {
  switch (action.type) {
    case 'INIT_STACKS' :
      return action.data;
    default:
      return state;
  }
};

export default stacks;
