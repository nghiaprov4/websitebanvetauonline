import { combineReducers } from 'redux';
import valueSearchSchedule from './valueSearchSchedule';
import reloadSeat from './reloadSeat';
import reloadSeatReturn from './reloadSeatReturn';
import reloadCart from './reloadCart';

const myReducer = combineReducers({
  valueSearchSchedule,
  reloadSeat,
  reloadSeatReturn,
  reloadCart
})

export default myReducer