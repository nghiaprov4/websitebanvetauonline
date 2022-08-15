const initState = false;

const myReducer = (state = initState, action) => {
  switch (action.type) {
    case 'RELOAD':
      state = true;
      return state;
    case 'NO_RELOAD':
      state = false;
      return state;
    default:
      return state;
  }
}

export default myReducer;