import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchPageAssets } from '../../ducks/hostedAssets.duck';
import { addMarketplaceEntities, getListingsById } from '../../ducks/marketplaceData.duck';
import { storableError } from '../../util/errors';
import { getImageVariantInfo } from '../EditListingPage/EditListingPage.duck';
import { responseListingIds } from '../../util/data';
import { getClientSideFeaturedCreators } from '../../util/api';

const PER_PAGE = 8;

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
  'cmsPage/searchFeaturedListings',
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
  const pageId = params.pageId;
  const pageAsset = { [pageId]: `content/pages/${pageId}.json` };
  const hasFallbackContent = false;
  return dispatch(fetchPageAssets(pageAsset, hasFallbackContent));
};

// ================ Slice ================ //

const initialState = {
  featuredListings: [],
  featuredListingsInProgress: false,
  featuredListingsError: null,
};

const cmsPageSlice = createSlice({
  name: 'CMSPage',
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

export default cmsPageSlice.reducer;

export const featuredListingsSelector = state => state.CMSPage.featuredListings;
export const customInProgressSelector = state =>
  state.CMSPage['featuredListingsInProgress'] || false;
