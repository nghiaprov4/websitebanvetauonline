const initState = {};

const myReducer = (state = initState, action) => {
  switch (action.type) {
    case 'VALUE_SEARCH_SCHEDULE':
      state = action.valueSearchSchedule
      return state;
    default:
      return state;
  }
}

export default myReducer;