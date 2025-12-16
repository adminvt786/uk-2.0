import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchPageAssets } from '../../ducks/hostedAssets.duck';
import { storableError } from '../../util/errors';
import { getImageVariantInfo } from '../EditListingPage/EditListingPage.duck';
import { addMarketplaceEntities, getListingsById } from '../../ducks/marketplaceData.duck';
export const ASSET_NAME = 'landing-page';

const PER_PAGE = 10;

// Helper to transform response to listing id array
const responseListingIds = data => data.data.map(l => l.id);

// Build default search params for listings
const getDefaultParams = config => {
  const imageVariantInfo = getImageVariantInfo(config.layout.listingImage);

  return {
    include: ['author', 'images', 'author.profileImage'],
    'fields.listing': ['title', 'description', 'price', 'deleted', 'state', 'publicData'],
    'fields.user': ['profile.displayName', 'profile.abbreviatedName'],
    'fields.image': imageVariantInfo.fieldsImage,
    ...imageVariantInfo.imageVariants,
    'limit.images': 1,
    perPage: PER_PAGE,
  };
};

// ================ Async thunks ================ //

export const searchFeaturedListings = createAsyncThunk(
  'landingPage/searchFeaturedListings',
  async (config, { dispatch, rejectWithValue, extra: sdk }) => {
    try {
      const response = await sdk.listings.query({
        ...getDefaultParams(config),
        pub_listingType: 'creators',
        meta_featured: true,
        sort: 'meta_ranking',
      });
      const listingFields = config?.listing?.listingFields;
      const sanitizeConfig = { listingFields };

      dispatch(addMarketplaceEntities(response, sanitizeConfig));
      return responseListingIds(response.data);
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
  featuredListingIds: [],
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
        state.featuredListingIds = action.payload;
      })
      .addCase(searchFeaturedListings.rejected, (state, action) => {
        state.featuredListingsInProgress = false;
        state.featuredListingsError = action.payload;
      });
  },
});

export default landingPageSlice.reducer;

export const customListingsSelector = state =>
  getListingsById(state, state.LandingPage['featuredListingIds']) || [];
export const customInProgressSelector = state =>
  state.LandingPage['featuredListingsInProgress'] || false;
