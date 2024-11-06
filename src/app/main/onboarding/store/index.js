import { combineReducers } from '@reduxjs/toolkit';
import onBoardingSlice from "./onBoardingSlice";

const onBoardingReducer = combineReducers({
    onBoardingSlice,
});

export default onBoardingReducer;
