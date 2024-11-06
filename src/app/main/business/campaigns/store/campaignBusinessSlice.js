import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const getCampaign = createAsyncThunk(
  'campaignBusiness/getCampaign',
  async (_, { getState }) => {
    const { campaigns } = getState().campaignBusiness;
    const { filters, query, page, results_per_page: resultsPerPage } = campaigns;
    const sampleBody = {
      query: query || '',
      page,
      results_per_page: resultsPerPage,
      sort_by: '',
      filters,
    };

    const response = await axios.post('/get-business-jobs', sampleBody);

    return response.data;
  },
);


const campaignBusinessSlice = createSlice({
  name: 'campaignBusiness/campaigns',

  initialState: {
    total_results: 0,
    results: [],
    page: 1,
    results_per_page: 20,
    query: '',
    sort_by: '',
    filters: { status: ['Live'] },
    isLoading: false,
    toggleSearch: false,
  },
  reducers: {
    setFilterStatus: (state, action) => {
      state.filters = { status: [action.payload] };
    },
    setCampaignQuery: {
      reducer: (state, action) => {
        state.query = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
    setSearchToggle: (state, action) => {
      state.toggleSearch = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setRowsPerPage: (state, action) => {
      state.results_per_page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCampaign.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCampaign.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          ...action.payload,
        };
      })
      .addCase(getCampaign.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const {
  setFilterStatus,
  setCampaignQuery,
  setSearchToggle,
  setPage,
  setRowsPerPage,
} = campaignBusinessSlice.actions;

export const selectCampaigns = ({ campaignBusiness }) => campaignBusiness.campaigns;
export const selectCampaignQuery = ({ campaignBusiness }) => campaignBusiness.campaigns.query;
export const selectToggleSearch = ({ campaignBusiness }) => campaignBusiness.campaigns.toggleSearch;

export default campaignBusinessSlice.reducer;
