const initState = false;

const myReducer = (state = initState, action) => {
    switch (action.type) {
        case 'RELOAD_SEAT':
            return true;
        case 'NO_RELOAD_SEAT':
            return false;
        default:
            return state;
    }
}

export default myReducer;