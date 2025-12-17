import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchPageAssets } from '../../ducks/hostedAssets.duck';
import { getClientSideFeaturedCreators } from '../../util/api';
import { storableError } from '../../util/errors';
export const ASSET_NAME = 'landing-page';

// ================ Async thunks ================ //

export const searchFeaturedListings = createAsyncThunk(
  'landingPage/searchFeaturedListings',
  async (config, { dispatch, rejectWithValue, extra: sdk }) => {
    try {
      const response = await getClientSideFeaturedCreators();
      return response.data;
    } catch (e) {
      return rejectWithValue(storableError(e));
    }
  },
  { serializeError: storableError }
);

// ================ Page asset loader ================ //
export const loadData = (params, search) => dispatch => {
  const pageAsset = { landingPage: `content/pages/${ASSET_NAME}.json` };
  return dispatch(fetchPageAssets(pageAsset, true));
};

// ================ Slice ================ //

const initialState = {
  featuredListings: [],
  featuredListingsInProgress: false,
  featuredListingsError: null,
};

const landingPageSlice = createSlice({
  name: 'landingPage',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Featured listings
      .addCase(searchFeaturedListings.pending, state => {
        state.featuredListingsInProgress = true;
        state.featuredListingsError = null;
      })
      .addCase(searchFeaturedListings.fulfilled, (state, action) => {
        state.featuredListingsInProgress = false;
        state.featuredListings = action.payload;
      })
      .addCase(searchFeaturedListings.rejected, (state, action) => {
        state.featuredListingsInProgress = false;
        state.featuredListingsError = action.payload;
      });
  },
});

export default landingPageSlice.reducer;

export const featuredListingsSelector = state => state.LandingPage.featuredListings;
export const customInProgressSelector = state =>
  state.LandingPage['featuredListingsInProgress'] || false;
