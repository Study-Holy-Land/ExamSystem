import editPaper from './editPaper';

const actionMap = {
  'EDIT_PAPER': editPaper
};

function paperDetail (state = {sections: []}, action) {
  const func = actionMap[action.type];

  if (!func) {
    return state;
  }

  return func(state, action.data);
}
export default paperDetail;
