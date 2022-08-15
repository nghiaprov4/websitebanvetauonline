import { combineReducers } from 'redux';
import valueSearch from './valueSearch';
import isActive from './isActive';
import idOrder from './idOrder';
import reloadData from './reloadData';
import reload from './reload';

const myReducer = combineReducers({
  valueSearch,
  isActive,
  idOrder,
  reloadData,
  reload,
})

export default myReducer