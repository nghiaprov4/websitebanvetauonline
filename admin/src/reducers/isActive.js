const initState = true;

const myReducer = (state = initState, action) => {
  switch (action.type) {
    case 'SHOW_NAV':
      state = true;
      return state;
    case 'HIDE_NAV':
      state = false;
      return state;
    default:
      return state;
  }
}

export default myReducer;