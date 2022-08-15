const initState = '';

const myReducer = (state = initState, action) => {
  switch (action.type) {
    case 'ID_ORDER':
      state = action.idOrder
      return state;
    default:
      return state;
  }
}

export default myReducer;