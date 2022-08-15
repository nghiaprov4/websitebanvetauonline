const initState = false;

const myReducer = (state = initState, action) => {
    switch (action.type) {
        case 'RELOAD_CART':
            return true;
        case 'NO_RELOAD_CART':
            return false;
        default:
            return state;
    }
}

export default myReducer;