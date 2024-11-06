import { combineReducers } from '@reduxjs/toolkit';
import campaigns from './campaignBusinessSlice';

const reducer = combineReducers({
  campaigns,
});

export default reducer;
