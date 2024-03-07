import { combineReducers } from "redux";

import homeReducer from '../redux/mainReducer';

export default combineReducers({
  home: homeReducer,
});