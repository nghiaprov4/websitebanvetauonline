const initState = [];

const myReducer = (state = initState, action) => {
  switch (action.type) {
    case 'DATA_SCHEDULE':
      state = action.dataSchedule
      return state;
    default:
      return state;
  }
}

export default myReducer;