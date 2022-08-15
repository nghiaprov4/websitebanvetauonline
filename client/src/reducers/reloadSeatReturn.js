const initState = false;

const myReducer = (state = initState, action) => {
    switch (action.type) {
        case 'RELOAD_SEAT_RETURN':
            return true;
        case 'NO_RELOAD_SEAT_RETURN':
            return false;
        default:
            return state;
    }
}

export default myReducer;