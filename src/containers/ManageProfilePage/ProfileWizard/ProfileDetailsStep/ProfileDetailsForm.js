import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import arrayMutators from 'final-form-arrays';
import { Field, Form as FinalForm } from 'react-final-form';

// Import util modules
import { FormattedMessage, useIntl } from '../../../../util/reactIntl';
import {
  autocompletePlaceSelected,
  autocompleteSearchRequired,
  composeValidators,
  required,
} from '../../../../util/validators';
import { isUploadImageOverLimitError } from '../../../../util/errors';

// Import shared components
import {
  Avatar,
  Button,
  FieldLocationAutocompleteInput,
  FieldTextInput,
  Form,
  H4,
  IconSpinner,
  ImageFromFile,
} from '../../../../components';

// Import modules from this directory
import css from './ProfileDetailsForm.module.css';
import { identity } from '../../../EditListingPage/EditListingWizard/EditListingDeliveryPanel/EditListingDeliveryForm';
import {
  AddListingFields,
  FieldSelectCategory,
} from '../../../EditListingPage/EditListingWizard/EditListingDetailsPanel/EditListingDetailsForm';
import { element } from 'prop-types';

const ACCEPT_IMAGES = 'image/*';
const UPLOAD_CHANGE_DELAY = 2000; // Show spinner so that browser has time to load img srcset

/**
 * Show various error messages
 * @param {Object} props
 * @param {Object} props.fetchErrors - The fetch errors object
 * @returns {JSX.Element|null}
 */
const ErrorMessage = props => {
  const { fetchErrors } = props;
  const { updateListingError, createListingDraftError, showListingsError } = fetchErrors || {};

  const errorMessage = updateListingError ? (
    <FormattedMessage id="ProfileDetailsForm.updateFailed" />
  ) : createListingDraftError ? (
    <FormattedMessage id="ProfileDetailsForm.createListingDraftError" />
  ) : showListingsError ? (
    <FormattedMessage id="ProfileDetailsForm.showListingFailed" />
  ) : null;

  if (errorMessage) {
    return <p className={css.error}>{errorMessage}</p>;
  }
  return null;
};

/**
 * ProfileDetailsForm component - Form for Step 1 of the profile wizard.
 * Collects display name, about me, and profile image for the profile listing.
 *
 * @component
 * @param {Object} props
 * @param {string} [props.className] - Custom class that extends the default class for the root element
 * @param {string} [props.formId] - The form id
 * @param {boolean} props.disabled - Whether the form is disabled
 * @param {boolean} props.ready - Whether the form is ready
 * @param {boolean} props.updated - Whether the form is updated
 * @param {boolean} props.updateInProgress - Whether the update is in progress
 * @param {Object} props.fetchErrors - The fetch errors object
 * @param {Object} props.initialValues - The initial form values
 * @param {string} props.saveActionMsg - The submit button text
 * @param {boolean} [props.autoFocus] - Whether the form should autofocus
 * @param {Function} props.onSubmit - The submit function
 * @param {Object} props.profileImage - The profile image object
 * @param {Function} props.onImageUpload - The image upload function
 * @param {boolean} props.uploadInProgress - Whether the image upload is in progress
 * @param {Object} props.uploadImageError - The image upload error
 * @param {Object} props.currentUser - The current user object
 * @returns {JSX.Element}
 */
const ProfileDetailsForm = props => {
  const [uploadDelay, setUploadDelay] = useState(false);
  const [allCategoriesChosen, setAllCategoriesChosen] = useState(false);

  const { profileImage, uploadInProgress, currentUser } = props;

  // Upload delay is additional time window where Avatar is added to the DOM,
  // but not yet visible (time to load image URL from srcset)
  useEffect(() => {
    let timeoutId;
    if (uploadInProgress === false && profileImage?.imageId) {
      setUploadDelay(true);
      timeoutId = window.setTimeout(() => {
        setUploadDelay(false);
      }, UPLOAD_CHANGE_DELAY);
    }
    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [uploadInProgress, profileImage?.imageId]);

  return (
    <FinalForm
      {...props}
      mutators={{ ...arrayMutators }}
      render={formRenderProps => {
        const {
          autoFocus,
          className,
          disabled,
          ready,
          formId = 'ProfileDetailsForm',
          handleSubmit,
          invalid,
          pristine,
          saveActionMsg,
          updated,
          updateInProgress,
          fetchErrors,
          form,
          onImageUpload,
          uploadImageError,
          values,
          listingFieldsConfig,
          selectableCategories,
          categoryPrefix,
          pickSelectedCategories,
        } = formRenderProps;

        const intl = useIntl();
        const { listingType, transactionProcessAlias, unitType } = values;
        const filteredListingFieldsConfig = listingFieldsConfig.filter(elm => true);
        const hasCategories = selectableCategories && selectableCategories.length > 0;
        const showCategories = listingType && hasCategories;

        const displayNameRequiredMessage = intl.formatMessage({
          id: 'ProfileDetailsForm.displayNameRequired',
        });

        // Image upload related
        const user = currentUser || {};
        const hasUploadError = !!uploadImageError && !uploadInProgress;
        const errorClasses = classNames({ [css.avatarUploadError]: hasUploadError });

        // Determine which image to show
        const transientUserProfileImage = profileImage?.uploadedImage || user.profileImage;
        const transientUser = { ...user, profileImage: transientUserProfileImage };

        // File upload in progress
        const fileExists = !!profileImage?.file;
        const fileUploadInProgress = uploadInProgress && fileExists;
        const delayAfterUpload = profileImage?.imageId && uploadDelay;

        const imageFromFile =
          fileExists && (fileUploadInProgress || delayAfterUpload) ? (
            <ImageFromFile
              id={profileImage.id}
              className={errorClasses}
              rootClassName={css.uploadingImage}
              aspectWidth={1}
              aspectHeight={1}
              file={profileImage.file}
            >
              {(uploadInProgress || uploadDelay) && (
                <div className={css.uploadingImageOverlay}>
                  <IconSpinner />
                </div>
              )}
            </ImageFromFile>
          ) : null;

        // Avatar is rendered in hidden during the upload delay
        const avatarClasses = classNames(errorClasses, css.avatar, {
          [css.avatarInvisible]: uploadDelay,
        });

        const avatarComponent =
          !fileUploadInProgress && (profileImage?.imageId || user.profileImage) ? (
            <Avatar
              className={avatarClasses}
              renderSizes="(max-width: 767px) 96px, 240px"
              user={transientUser}
              disableProfileLink
            />
          ) : null;

        const chooseAvatarLabel =
          profileImage?.imageId || fileUploadInProgress || user.profileImage ? (
            <div className={css.avatarContainer}>
              {imageFromFile}
              {avatarComponent}
              <div className={css.changeAvatar}>
                <FormattedMessage id="ProfileDetailsForm.changeAvatar" />
              </div>
            </div>
          ) : (
            <div className={css.avatarPlaceholder}>
              <div className={css.avatarPlaceholderText}>
                <FormattedMessage id="ProfileDetailsForm.addYourProfilePicture" />
              </div>
              <div className={css.avatarPlaceholderTextMobile}>
                <FormattedMessage id="ProfileDetailsForm.addYourProfilePictureMobile" />
              </div>
            </div>
          );

        const addressRequiredMessage = intl.formatMessage({
          id: 'ProfileDetailsForm.addressRequired',
        });
        const addressNotRecognizedMessage = intl.formatMessage({
          id: 'ProfileDetailsForm.addressNotRecognized',
        });

        const classes = classNames(css.root, className);
        const submitReady = (updated && pristine) || ready;
        const submitInProgress = updateInProgress;
        const submitDisabled = invalid || disabled || submitInProgress || uploadInProgress;

        return (
          <Form className={classes} onSubmit={handleSubmit}>
            <ErrorMessage fetchErrors={fetchErrors} />

            {/* Profile Image Upload Section */}
            <div className={css.sectionContainer}>
              <H4 as="h2" className={css.sectionTitle}>
                <FormattedMessage id="ProfileDetailsForm.yourProfilePicture" />
              </H4>
              <Field
                accept={ACCEPT_IMAGES}
                id="profileImage"
                name="profileImage"
                label={chooseAvatarLabel}
                type="file"
                form={null}
                uploadImageError={uploadImageError}
                disabled={uploadInProgress}
              >
                {fieldProps => {
                  const {
                    accept,
                    id,
                    input,
                    label,
                    disabled: fieldDisabled,
                    uploadImageError: fieldUploadError,
                  } = fieldProps;
                  const { name, type } = input;
                  const onChange = e => {
                    const file = e.target.files[0];
                    form.change('profileImage', file);
                    form.blur('profileImage');
                    if (file != null && onImageUpload) {
                      const tempId = `${file.name}_${Date.now()}`;
                      onImageUpload({ id: tempId, file });
                    }
                  };

                  let error = null;
                  if (isUploadImageOverLimitError(fieldUploadError)) {
                    error = (
                      <div className={css.error}>
                        <FormattedMessage id="ProfileDetailsForm.imageUploadFailedFileTooLarge" />
                      </div>
                    );
                  } else if (fieldUploadError) {
                    error = (
                      <div className={css.error}>
                        <FormattedMessage id="ProfileDetailsForm.imageUploadFailed" />
                      </div>
                    );
                  }

                  return (
                    <div className={css.uploadAvatarWrapper}>
                      <label className={css.label} htmlFor={id}>
                        {label}
                      </label>
                      <input
                        accept={accept}
                        id={id}
                        name={name}
                        className={css.uploadAvatarInput}
                        disabled={fieldDisabled}
                        onChange={onChange}
                        type={type}
                      />
                      {error}
                    </div>
                  );
                }}
              </Field>
              <div className={css.tip}>
                <FormattedMessage id="ProfileDetailsForm.tip" />
              </div>
              <div className={css.fileInfo}>
                <FormattedMessage id="ProfileDetailsForm.fileInfo" />
              </div>
            </div>

            <FieldTextInput
              id={`${formId}displayName`}
              name="title"
              className={css.displayName}
              type="text"
              label={intl.formatMessage({ id: 'ProfileDetailsForm.displayNameLabel' })}
              placeholder={intl.formatMessage({
                id: 'ProfileDetailsForm.displayNamePlaceholder',
              })}
              validate={required(displayNameRequiredMessage)}
              autoFocus={autoFocus}
            />

            <FieldTextInput
              id={`${formId}aboutMe`}
              name="description"
              className={css.aboutMe}
              type="textarea"
              label={intl.formatMessage({ id: 'ProfileDetailsForm.aboutMeLabel' })}
              placeholder={intl.formatMessage({
                id: 'ProfileDetailsForm.aboutMePlaceholder',
              })}
              validate={required(
                intl.formatMessage({
                  id: 'ProfileDetailsForm.aboutMeRequired',
                })
              )}
            />

            <FieldLocationAutocompleteInput
              rootClassName={css.input}
              inputClassName={css.locationAutocompleteInput}
              iconClassName={css.locationAutocompleteInputIcon}
              predictionsClassName={css.predictionsRoot}
              validClassName={css.validLocation}
              name="location"
              id={`${formId}.location`}
              label={intl.formatMessage({ id: 'ProfileDetailsForm.address' })}
              placeholder={intl.formatMessage({
                id: 'ProfileDetailsForm.addressPlaceholder',
              })}
              useDefaultPredictions={false}
              format={identity}
              valueFromForm={values.location}
              validate={composeValidators(
                autocompleteSearchRequired(addressRequiredMessage),
                autocompletePlaceSelected(addressNotRecognizedMessage)
              )}
              key={'locationValidation'}
            />

            {showCategories && (
              <FieldSelectCategory
                values={values}
                prefix={categoryPrefix}
                listingCategories={selectableCategories}
                formApi={form}
                intl={intl}
                allCategoriesChosen={allCategoriesChosen}
                setAllCategoriesChosen={setAllCategoriesChosen}
              />
            )}

            <AddListingFields
              listingType={listingType}
              listingFieldsConfig={filteredListingFieldsConfig}
              selectedCategories={pickSelectedCategories(values)}
              formId={formId}
              intl={intl}
            />

            <Button
              className={css.submitButton}
              type="submit"
              inProgress={submitInProgress}
              disabled={submitDisabled}
              ready={submitReady}
            >
              {saveActionMsg}
            </Button>
          </Form>
        );
      }}
    />
  );
};

export default ProfileDetailsForm;
