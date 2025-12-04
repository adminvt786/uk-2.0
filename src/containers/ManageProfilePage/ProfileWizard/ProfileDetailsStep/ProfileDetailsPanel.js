import React from 'react';
import classNames from 'classnames';

// Import modules from this directory
import ProfileDetailsForm from './ProfileDetailsForm';
import css from './ProfileDetailsPanel.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { currentUserDisplayNameSelector, currentUserSelector } from '../../../../ducks/user.duck';
import {
  createListingDraftInProgressSelector,
  profileImageSelector,
  updateProfileInProgressSelector,
  uploadImage,
  profileImageUploadErrorSelector,
  profileImageUploadInProgressSelector,
} from '../../ManageProfilePage.duck';
import { pickCategoryFields } from '../../../../util/fieldHelpers';
import {
  initialValuesForListingFields,
  pickListingFieldsData,
} from '../../../EditListingPage/EditListingWizard/EditListingDetailsPanel/EditListingDetailsPanel';

/**
 * Get initialValues for the form from the profile listing.
 *
 * @param {Object} profileListing - The profile listing object
 * @param {string} currentUserDisplayName - The current user's display name
 * @returns {Object} initialValues object for the form
 */
const getInitialValues = (
  profileListing,
  currentUserDisplayName,
  listingFields,
  listingCategories,
  categoryKey
) => {
  const { description, title, publicData, geolocation } = profileListing?.attributes || {};
  const {
    listingType = 'creators',
    transactionProcessAlias = 'default-purchase/release-1',
    unitType = 'item',
  } = publicData || {};
  const locationFieldsPresent = publicData?.location?.address && geolocation;
  const location = publicData?.location || {};
  const { address } = location;

  const nestedCategories = pickCategoryFields(publicData, categoryKey, 1, listingCategories);

  return {
    title: currentUserDisplayName ?? title,
    description: description ?? '',
    listingType,
    transactionProcessAlias,
    unitType,
    ...nestedCategories,
    ...initialValuesForListingFields(
      publicData,
      'public',
      listingType,
      nestedCategories,
      listingFields
    ),
    location: locationFieldsPresent
      ? {
          search: address,
          selectedPlace: { address, origin: geolocation },
        }
      : { search: undefined, selectedPlace: undefined },
  };
};

/**
 * The ProfileDetailsPanel component.
 * This panel wraps the ProfileDetailsForm and handles the submit logic.
 *
 * @component
 * @param {Object} props
 * @param {string} [props.className] - Custom class that extends the default class for the root element
 * @param {string} [props.rootClassName] - Custom class that overrides the default class for the root element
 * @param {Object} props.profileListing - The profile listing object
 * @param {boolean} props.disabled - Whether the form is disabled
 * @param {boolean} props.ready - Whether the form is ready
 * @param {Function} props.onSubmit - The submit function
 * @param {string} props.submitButtonText - The submit button text
 * @param {boolean} props.panelUpdated - Whether the panel is updated
 * @param {boolean} props.updateInProgress - Whether the update is in progress
 * @param {Object} props.errors - The errors object
 * @returns {JSX.Element}
 */
const ProfileDetailsPanel = props => {
  const dispatch = useDispatch();
  const currentUser = useSelector(currentUserSelector);
  const currentUserDisplayName = useSelector(currentUserDisplayNameSelector);
  const createListingDraftInProgress = useSelector(createListingDraftInProgressSelector);
  const updateProfileInProgress = useSelector(updateProfileInProgressSelector);
  const profileImage = useSelector(profileImageSelector);
  const profileImageUploadInProgress = useSelector(profileImageUploadInProgressSelector);
  const profileImageUploadError = useSelector(profileImageUploadErrorSelector);

  const {
    className,
    rootClassName,
    profileListing,
    disabled,
    ready,
    onSubmit,
    submitButtonText,
    panelUpdated,
    errors,
    config,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const listingFields = config.listing.listingFields;
  const listingCategories = config.categoryConfiguration.categories;
  const categoryKey = config.categoryConfiguration.key;

  const initialValues = getInitialValues(
    profileListing,
    currentUserDisplayName,
    listingFields,
    listingCategories,
    categoryKey
  );

  const handleImageUpload = data => {
    dispatch(uploadImage(data));
  };

  return (
    <div className={classes}>
      <ProfileDetailsForm
        className={css.form}
        initialValues={initialValues}
        saveActionMsg={submitButtonText}
        onSubmit={values => {
          const {
            title,
            description,
            profileImage: formProfileImage,
            listingType,
            transactionProcessAlias,
            unitType,
            location,
            ...rest
          } = values;

          console.log('ProfileDetailsPanel onSubmit values:', values);

          const nestedCategories = pickCategoryFields(rest, categoryKey, 1, listingCategories);
          // Remove old categories by explicitly saving null for them.
          const cleanedNestedCategories = {
            ...[1, 2, 3].reduce((a, i) => ({ ...a, [`${categoryKey}${i}`]: null }), {}),
            ...nestedCategories,
          };
          const publicListingFields = pickListingFieldsData(
            rest,
            'public',
            listingType,
            nestedCategories,
            listingFields
          );

          const address = location?.selectedPlace?.address || null;
          const origin = location?.selectedPlace?.origin || null;
          const locationDataMaybe = address ? { location: { address } } : {};

          // Prepare values for submission
          const updateValues = {
            geolocation: origin,
            title: title.trim(),
            description: description?.trim() || '',
            publicData: {
              listingType,
              transactionProcessAlias,
              unitType,
              ...cleanedNestedCategories,
              ...publicListingFields,
              ...locationDataMaybe,
            },
          };

          if (profileImage?.imageId) {
            updateValues.profileImageId = profileImage.imageId;
            updateValues.updateUser = true;
          }

          if (initialValues.title !== title || initialValues.description !== description) {
            updateValues.updateUser = true;
          }

          onSubmit(updateValues);
        }}
        disabled={disabled}
        ready={ready}
        updated={panelUpdated}
        updateInProgress={createListingDraftInProgress || updateProfileInProgress}
        fetchErrors={errors}
        autoFocus
        currentUser={currentUser}
        profileImage={profileImage}
        onImageUpload={handleImageUpload}
        uploadInProgress={profileImageUploadInProgress}
        uploadImageError={profileImageUploadError}
        listingFieldsConfig={listingFields}
        selectableCategories={listingCategories}
        categoryPrefix={categoryKey}
        pickSelectedCategories={values =>
          pickCategoryFields(values, categoryKey, 1, listingCategories)
        }
      />
    </div>
  );
};

export default ProfileDetailsPanel;
