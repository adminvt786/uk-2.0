import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { storableError } from '../../util/errors';
import { addMarketplaceEntities, getOwnProfileListingById } from '../../ducks/marketplaceData.duck';
import { getImageVariantInfo } from '../EditListingPage/EditListingPage.duck';
import { updateProfile, updateProfileThunk } from '../ProfileSettingsPage/ProfileSettingsPage.duck';

// ================ Async thunks ================ //

export const uploadImage = createAsyncThunk(
  'ManageProfilePage/uploadImage',
  ({ id, file }, { rejectWithValue, extra: sdk }) => {
    const queryParams = {
      expand: true,
      'fields.image': ['variants.square-small', 'variants.square-small2x'],
    };

    return sdk.images
      .upload({ image: file }, queryParams)
      .then(resp => {
        const uploadedImage = resp.data.data;
        return { id, uploadedImage };
      })
      .catch(e => {
        return rejectWithValue({ id, error: storableError(e) });
      });
  }
);

export const fetchProfileListing = createAsyncThunk(
  'ManageProfilePage/fetchProfileListing',
  async ({ id, config }, { dispatch, extra: sdk, rejectWithValue }) => {
    try {
      const imageVariantInfo = getImageVariantInfo(config.layout.listingImage);
      const queryParams = {
        include: ['author', 'images'],
        'fields.image': imageVariantInfo.fieldsImage,
        ...imageVariantInfo.imageVariants,
      };
      const res = await sdk.ownListings.show({ id, ...queryParams });
      dispatch(addMarketplaceEntities(res));
      return res.data.data.id;
    } catch (error) {
      return rejectWithValue(storableError(error));
    }
  }
);

export const updateProfileListing = createAsyncThunk(
  'ManageProfilePage/updateProfileListing',
  async ({ data, config }, { dispatch, extra: sdk, rejectWithValue }) => {
    try {
      const { updateUser, profileImageId, ...rest } = data;
      const imageVariantInfo = getImageVariantInfo(config.layout.listingImage);
      const queryParams = {
        expand: true,
        include: ['author', 'images', 'currentStock'],
        'fields.image': imageVariantInfo.fieldsImage,
        ...imageVariantInfo.imageVariants,
      };

      const res = await sdk.ownListings.update(rest, queryParams);

      if (updateUser) {
        await dispatch(
          updateProfileThunk({
            displayName: data.title,
            bio: data.description,
            ...(!!profileImageId ? { profileImageId } : {}),
            publicData: {
              profileListingId: res.data.data.id.uuid,
            },
          })
        );
      }

      dispatch(addMarketplaceEntities(res));
      return res;
    } catch (error) {
      return rejectWithValue(storableError(error));
    }
  }
);

export const createProfileListingDraft = createAsyncThunk(
  'ManageProfilePage/createProfileListingDraft',
  async ({ data, config }, { dispatch, extra: sdk, rejectWithValue }) => {
    try {
      const imageVariantInfo = getImageVariantInfo(config.layout.listingImage);
      const queryParams = {
        expand: true,
        include: ['author', 'images', 'currentStock'],
        'fields.image': imageVariantInfo.fieldsImage,
        ...imageVariantInfo.imageVariants,
      };

      const res = await sdk.ownListings.createDraft(data, queryParams);

      await dispatch(
        updateProfileThunk({
          displayName: data.title,
          bio: data.description,
          publicData: {
            profileListingId: res.data.data.id.uuid,
          },
        })
      );

      dispatch(addMarketplaceEntities(res));
      return res;
    } catch (error) {
      return rejectWithValue(storableError(error));
    }
  }
);

// ================ Slice ================ //

const manageProfileSlice = createSlice({
  name: 'ManageProfilePage',
  initialState: {
    profileListingId: null,
    profileListingInProgress: false,
    profileListingError: null,

    createListingDraftInProgress: false,
    createListingDraftError: null,

    updateProfileInProgress: false,
    updateProfileError: null,

    // Profile image upload state
    profileImage: null,
    profileImageUploadError: null,
    profileImageUploadInProgress: false,
  },
  reducers: {
    changePasswordClear: state => {
      //   state.changePasswordError = null;
      //   state.changePasswordInProgress = false;
      //   state.passwordChanged = false;
      //   state.resetPasswordInProgress = false;
      //   state.resetPasswordError = null;
    },
  },
  extraReducers: builder => {
    builder
      // Upload profile image cases
      .addCase(uploadImage.pending, (state, action) => {
        const { id, file } = action.meta.arg;
        state.profileImage = { id, file };
        state.profileImageUploadInProgress = true;
        state.profileImageUploadError = null;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        const { id, uploadedImage } = action.payload;
        const { file } = state.profileImage || {};
        state.profileImage = { id, imageId: uploadedImage.id, file, uploadedImage };
        state.profileImageUploadInProgress = false;
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.profileImage = null;
        state.profileImageUploadInProgress = false;
        state.profileImageUploadError = action.payload?.error;
      })
      // Fetch profile listing cases
      .addCase(fetchProfileListing.pending, state => {
        state.profileListingInProgress = true;
        state.profileListingError = null;
      })
      .addCase(fetchProfileListing.fulfilled, (state, action) => {
        state.profileListingInProgress = false;
        state.profileListingId = action.payload;
      })
      .addCase(fetchProfileListing.rejected, (state, action) => {
        state.profileListingInProgress = false;
        state.profileListingError = action.payload;
      })
      // Create profile listing draft cases
      .addCase(createProfileListingDraft.pending, state => {
        state.createListingDraftInProgress = true;
        state.createListingDraftError = null;
      })
      .addCase(createProfileListingDraft.fulfilled, (state, action) => {
        state.createListingDraftInProgress = false;
      })
      .addCase(createProfileListingDraft.rejected, (state, action) => {
        state.createListingDraftInProgress = false;
        state.createListingDraftError = action.payload;
      })
      // Update profile listing cases
      .addCase(updateProfileListing.pending, state => {
        state.updateProfileInProgress = true;
        state.updateProfileError = null;
      })
      .addCase(updateProfileListing.fulfilled, (state, action) => {
        state.updateProfileInProgress = false;
      })
      .addCase(updateProfileListing.rejected, (state, action) => {
        state.updateProfileInProgress = false;
        state.updateProfileError = action.payload;
      });
  },
});

export const { changePasswordClear } = manageProfileSlice.actions;

export const loadData = (_, __, config) => (dispatch, getState, sdk) => {
  const state = getState();
  const currentUser = state.user?.currentUser;
  const { profileListingId } = currentUser.attributes.profile.publicData;

  if (profileListingId) {
    return dispatch(fetchProfileListing({ id: profileListingId, config }));
  } else {
    return Promise.resolve();
  }
};

export default manageProfileSlice.reducer;

// ================ Selectors ================ //
export const profileListingIdSelector = state => state.ManageProfilePage.profileListingId;
export const profileListingInProgressSelector = state =>
  state.ManageProfilePage.profileListingInProgress;
export const profileListingSelector = state => {
  return state.ManageProfilePage.profileListingId
    ? getOwnProfileListingById(state, [state.ManageProfilePage.profileListingId])[0]
    : null;
};
export const updateProfileInProgressSelector = state =>
  state.ManageProfilePage.updateProfileInProgress;
export const createListingDraftInProgressSelector = state =>
  state.ManageProfilePage.createListingDraftInProgress;

// Profile image upload selectors
export const profileImageSelector = state => state.ManageProfilePage.profileImage;
export const profileImageUploadInProgressSelector = state =>
  state.ManageProfilePage.profileImageUploadInProgress;
export const profileImageUploadErrorSelector = state =>
  state.ManageProfilePage.profileImageUploadError;
