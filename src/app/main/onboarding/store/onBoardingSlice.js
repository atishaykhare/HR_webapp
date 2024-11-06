import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import {showMessage} from "app/store/fuse/messageSlice";

export const getLanguages = createAsyncThunk('onBoarding/getLanguages', async (_, {getState}) => {
    const {query} = getState().onBoarding;
    const sampleBody = {
        query: query || '', "exclude": [],
    };
    const response = await axios.post('/constants/language', sampleBody);

    return response.data;
},);


export const getCategory = createAsyncThunk('onBoarding/getCategory', async (_, {getState}) => {

    const {query} = getState().onBoarding;
    const sampleBody = {
        query: query || '', "exclude": [],
    };
    const response = await axios.post('/constants/category', sampleBody);

    return response.data;
},);

export const saveOnBoarding = createAsyncThunk('onBoarding/saveOnBoarding', async ({data, type}, {getState, dispatch}) => {
    try {
        const response = await axios.post(`/onboarding?type=${type}`, data);
        return response.data;
    } catch (res) {
        const message = res.response.data.message || 'An error occurred while saving your onboarding details.';
        dispatch(showMessage({message, 'variant':'error'}))
    }
});

const onBoardingSlice = createSlice({
    name: 'onBoarding', initialState: {
        languages: {
            result: [], query: '', isLoading: false, isOpen: false,
        }, otherLanguages: {
            isOpen: false,
        }, category: {
            isOpen: false, result: [], isLoading: true,
        }, isLoading: false,
    }, reducers: {
        setQuery: {
            reducer: (state, action) => {
                state.languages.query = action.payload;
            }, prepare: (event) => ({payload: event.target.value || ''}),
        }, setIsOpen: {
            reducer: (state, action) => {
                const {isOpen, key} = action.payload;
                state[key].isOpen = isOpen;
            }, prepare: (val, key) => {
                return {
                    payload: {
                        isOpen: val, key: key,
                    },
                }
            }
        },
    }, extraReducers: (builder) => {
        builder
            .addCase(getLanguages.pending, (state) => {
                state.languages.isLoading = true;
            })
            .addCase(getLanguages.fulfilled, (state, action) => {
                return {
                    ...state, languages: {
                        ...state.languages,
                        result: action.payload,
                        query: state.languages.query || '',
                        isLoading: false,
                    },
                };
            })
            .addCase(getLanguages.rejected, (state) => {
                state.languages.isLoading = false;
            });
        builder.addCase(getCategory.pending, (state) => {
            state.category.isLoading = true;
        })
            .addCase(getCategory.fulfilled, (state, action) => {
                return {
                    ...state, category: {
                        result: action.payload, query: state.category.query || '', isOpen: true, isLoading: false,
                    },
                };
            })
            .addCase(getCategory.rejected, (state) => {
                state.category.isLoading = false;
            });
        builder.addCase(saveOnBoarding.pending, (state) => {
            state.isLoading = true;
        })
            .addCase(saveOnBoarding.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(saveOnBoarding.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export const {
    setQuery, setIsOpen,
} = onBoardingSlice.actions;

export const selectLanguages = ({onBoarding}) => onBoarding.onBoardingSlice.languages;
export const selectOtherLanguages = ({onBoarding}) => onBoarding.onBoardingSlice.otherLanguages;
export const selectCategory = ({onBoarding}) => onBoarding.onBoardingSlice.category;
export const selectLoading = ({onBoarding}) => onBoarding.onBoardingSlice.isLoading;

export default onBoardingSlice.reducer;
