const initState = false;

const myReducer = (state = initState, action) => {
  switch (action.type) {
    case 'RELOAD1':
      state = true;
      return state;
    case 'NO_RELOAD1':
      state = false;
      return state;
    default:
      return state;
  }
}

export default myReducer;