import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import arrayMutators from 'final-form-arrays';
import { Field, Form as FinalForm } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

// Import util modules
import { FormattedMessage, useIntl } from '../../../../util/reactIntl';
import {
  autocompletePlaceSelected,
  autocompleteSearchRequired,
  composeValidators,
  required,
  videoRequired,
} from '../../../../util/validators';
import { isUploadImageOverLimitError } from '../../../../util/errors';

// Import shared components
import {
  AspectRatioWrapper,
  Avatar,
  Button,
  FieldLocationAutocompleteInput,
  FieldTextInput,
  Form,
  H4,
  IconsCollection,
  IconSpinner,
  ImageFromFile,
  ResponsiveImage,
} from '../../../../components';

// Import modules from this directory
import css from './ProfileDetailsForm.module.css';
import { identity } from '../../../EditListingPage/EditListingWizard/EditListingDeliveryPanel/EditListingDeliveryForm';
import {
  AddListingFields,
  FieldSelectCategory,
} from '../../../EditListingPage/EditListingWizard/EditListingDetailsPanel/EditListingDetailsForm';
import ProfileWizardFooter from '../ProfileWizardFooter/ProfileWizardFooter';
import * as UpChunk from '@mux/upchunk';
import { getMuxAsset, getMuxUploadUrlWatermark } from '../../../../util/api';
import { PLAY_ICON } from '../../../../components/IconsCollection/IconsCollection';
import PlayVideoModal from './PlayVideoModal';
import { ARRAY_ERROR } from 'final-form';

const ACCEPT_IMAGES = 'image/*';
const UPLOAD_CHANGE_DELAY = 2000; // Show spinner so that browser has time to load img srcset
const ACCEPT_VIDEOS = 'video/*';

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

// Media kit image upload error component
export const MediaKitUploadError = props => {
  return props.uploadOverLimit ? (
    <p className={css.error}>
      <FormattedMessage id="ProfileDetailsForm.mediaKitUploadOverLimit" />
    </p>
  ) : props.uploadError ? (
    <p className={css.error}>
      <FormattedMessage id="ProfileDetailsForm.mediaKitUploadFailed" />
    </p>
  ) : null;
};

// Remove button for media kit images
const RemoveImageButton = props => {
  const { onClick } = props;
  return (
    <button className={css.removeImageButton} onClick={onClick} type="button">
      <svg
        width="10px"
        height="10px"
        viewBox="0 0 10 10"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g strokeWidth="1" fillRule="evenodd">
          <g transform="translate(-821.000000, -311.000000)">
            <g transform="translate(809.000000, 299.000000)">
              <path
                d="M21.5833333,16.5833333 L17.4166667,16.5833333 L17.4166667,12.4170833 C17.4166667,12.1866667 17.2391667,12 17.00875,12 C16.77875,12 16.5920833,12.18625 16.5920833,12.41625 L16.5883333,16.5833333 L12.4166667,16.5833333 C12.18625,16.5833333 12,16.7695833 12,17 C12,17.23 12.18625,17.4166667 12.4166667,17.4166667 L16.5875,17.4166667 L16.5833333,21.5829167 C16.5829167,21.8129167 16.7691667,21.9995833 16.9991667,22 L16.9995833,22 C17.2295833,22 17.41625,21.81375 17.4166667,21.58375 L17.4166667,17.4166667 L21.5833333,17.4166667 C21.8133333,17.4166667 22,17.23 22,17 C22,16.7695833 21.8133333,16.5833333 21.5833333,16.5833333"
                transform="translate(17.000000, 17.000000) rotate(-45.000000) translate(-17.000000, -17.000000) "
              />
            </g>
          </g>
        </g>
      </svg>
    </button>
  );
};

// Media kit image component - displays uploaded or uploading images
const MediaKitImage = props => {
  const {
    image,
    onRemoveImage,
    intl,
    aspectWidth = 1,
    aspectHeight = 1,
    // variantPrefix = 'scaled',
  } = props;

  const handleRemoveClick = e => {
    e.stopPropagation();
    onRemoveImage();
  };

  if (image.file && !image.imageId) {
    // Image is uploading - show file preview with spinner
    return (
      <ImageFromFile
        id={image.id}
        className={css.mediaKitThumbnail}
        file={image.file}
        aspectWidth={aspectWidth}
        aspectHeight={aspectHeight}
      >
        <div className={css.mediaKitThumbnailLoading}>
          <IconSpinner />
        </div>
      </ImageFromFile>
    );
  } else {
    // Image is uploaded - show ResponsiveImage
    // Handle both newly uploaded images (with uploadedImage) and listing images (with attributes)
    const hasUploadedImage = !!image.uploadedImage;
    const hasAttributes = !!image.attributes;

    if (!hasUploadedImage && !hasAttributes) return null;

    const imageId = image.imageId || image.id;
    const imageData = hasUploadedImage ? image.uploadedImage : image;
    const imgForResponsiveImage = { ...imageData, id: imageId };
    const variants = imageData.attributes?.variants
      ? Object.keys(imageData.attributes.variants).filter(
          k => k.startsWith('scaled') || k.startsWith('listing')
        )
      : [];

    return (
      <div className={css.mediaKitThumbnail}>
        <div className={css.mediaKitImageWrapper}>
          <AspectRatioWrapper width={aspectWidth} height={aspectHeight}>
            <ResponsiveImage
              rootClassName={css.mediaKitRootForImage}
              image={imgForResponsiveImage}
              alt={intl.formatMessage({ id: 'ProfileDetailsForm.mediaKitImageAlt' })}
              variants={variants}
            />
          </AspectRatioWrapper>
          <RemoveImageButton onClick={handleRemoveClick} />
        </div>
      </div>
    );
  }
};

// Field component that shows media kit images from "images" field array
export const FieldMediaKitImage = props => {
  const { name, intl, onRemoveImage, aspectWidth, aspectHeight, variantPrefix } = props;
  return (
    <Field name={name}>
      {fieldProps => {
        const { input } = fieldProps;
        const image = input.value;
        return image ? (
          <MediaKitImage
            image={image}
            key={image?.id?.uuid || image?.id}
            onRemoveImage={() => {
              onRemoveImage(image?.imageId || image?.id);
            }}
            intl={intl}
            aspectWidth={aspectWidth}
            aspectHeight={aspectHeight}
            variantPrefix={variantPrefix}
          />
        ) : null;
      }}
    </Field>
  );
};

// Field component for adding new media kit images
export const FieldAddMediaKitImage = props => {
  const {
    formApi,
    onImageUploadHandler,
    aspectWidth = 1,
    aspectHeight = 1,
    disabled,
    ...rest
  } = props;
  return (
    <Field form={null} {...rest}>
      {fieldprops => {
        const { accept, input, label, disabled: fieldDisabled } = fieldprops;
        const { name, type } = input;
        const onChange = e => {
          const file = e.target.files[0];
          if (file) {
            console.log({ file });
            formApi.change('addMediaKitImage', file);
            formApi.blur('addMediaKitImage');
            onImageUploadHandler(file);
          }
        };
        const inputProps = { accept, id: name, name, onChange, type };
        return (
          <div className={css.addMediaKitImageWrapper}>
            <AspectRatioWrapper width={aspectWidth} height={aspectHeight}>
              {fieldDisabled || disabled ? null : (
                <input {...inputProps} className={css.addMediaKitImageInput} />
              )}
              <label htmlFor={name} className={css.addMediaKitImage}>
                {label}
              </label>
            </AspectRatioWrapper>
          </div>
        );
      }}
    </Field>
  );
};

// Field component that uses file-input to allow user to select videos.
export const FieldAddVideo = props => {
  const { formApi, onVideoUploadHandler, aspectWidth = 1, aspectHeight = 1, ...rest } = props;

  return (
    <Field form={null} {...rest}>
      {fieldprops => {
        const { accept, input, label, disabled: fieldDisabled } = fieldprops;
        const { name, type } = input;
        const onChange = e => {
          const file = e.target.files[0];
          onVideoUploadHandler(file);
        };
        const inputProps = { accept, id: name, name, onChange, type };

        return (
          <div className={css.addMediaKitImageWrapper}>
            <AspectRatioWrapper width={aspectWidth} height={aspectHeight}>
              {fieldDisabled ? null : (
                <input {...inputProps} className={css.addMediaKitImageInput} />
              )}
              <label htmlFor={name} className={css.addMediaKitImage}>
                {label}
              </label>
            </AspectRatioWrapper>
          </div>
        );
      }}
    </Field>
  );
};

const FieldVideoItem = props => {
  const { name, onRemoveVideo, setOpenVideoModal, ...rest } = props;
  return (
    <Field name={name} {...rest}>
      {fieldProps => {
        const { input } = fieldProps;
        const video = input.value;
        return video ? (
          <div className={css.videoElement}>
            <img src={`https://image.mux.com/${video?.playback_id}/thumbnail.png`} />
            <div className={css.actionButtonWrapper}>
              <RemoveImageButton onClick={() => onRemoveVideo()} />
            </div>
            <span className={css.playButton} onClick={() => setOpenVideoModal(video?.playback_id)}>
              <IconsCollection type={PLAY_ICON} />
            </span>
          </div>
        ) : null;
      }}
    </Field>
  );
};

/**
 * VideoSection component - Handles video upload, display, and playback
 * @component
 * @param {Object} props
 * @param {Object} props.form - The form API from react-final-form
 * @param {Object} props.values - The current form values
 * @param {boolean} props.videoUploadRequested - Whether a video upload is in progress
 * @param {Function} props.setVideoUploadRequested - Function to set video upload state
 * @param {number} props.progress - Upload progress percentage
 * @param {Function} props.setProgress - Function to set upload progress
 * @param {number} props.aspectWidth - Aspect ratio width
 * @param {number} props.aspectHeight - Aspect ratio height
 */
const VideoSection = props => {
  const {
    form,
    values,
    videoUploadRequested,
    setVideoUploadRequested,
    progress,
    setProgress,
    aspectWidth,
    aspectHeight,
    intl,
  } = props;
  const [openVideoModal, setOpenVideoModal] = useState(null);
  const onVideoUploadHandler = async file => {
    try {
      setVideoUploadRequested(true);
      if (!file) {
        throw new Error('File is missing');
      }

      const uploadData = await getMuxUploadUrlWatermark();

      const upload = UpChunk.createUpload({
        endpoint: uploadData.url,
        file,
        chunkSize: 5120,
      });

      // Subscribe to events
      upload.on('error', error => {
        console.error('Video upload error:', error.detail);
        setVideoUploadRequested(false);
        setProgress(0);
      });

      upload.on('progress', progress => {
        setProgress(progress.detail);
      });

      upload.on('success', async () => {
        let res = await getMuxAsset({ uploadId: uploadData.id });

        if (!res?.duration) {
          async function waitForAssetReady() {
            const assetRes = await getMuxAsset({ uploadId: uploadData.id });

            if (assetRes.status === 'preparing') {
              // Still preparing, wait and check again after a delay
              await new Promise(resolve => setTimeout(resolve, 2000));
              return waitForAssetReady(); // Recursive call
            } else {
              return assetRes; // Asset is ready, return the response
            }
          }

          res = await waitForAssetReady(); // Wait for the asset to be ready
        }

        setVideoUploadRequested(false);
        setProgress(0);
        const videos = values?.videos || [];
        const newVideos = [
          ...videos,
          {
            asset_id: res.asset_id,
            playback_id: res.playback_id,
            thumbnailTime: 1,
          },
        ];
        form.change('videos', newVideos);
      });
    } catch (error) {
      console.log('error', error);
      setVideoUploadRequested(false);
    }
  };
  const touched = form.getState().touched;
  const addVideoError =
    touched.addVideo && !values?.videos?.length
      ? intl.formatMessage({ id: 'ProfileDetailsForm.videoRequired' })
      : null;
  console.log({ addVideoError, touched, values });
  return (
    <>
      <div className={css.mediaKitImagesFieldArray}>
        <FieldArray
          name="videos"
          validate={videoRequired(intl.formatMessage({ id: 'ProfileDetailsForm.videoRequired' }))}
        >
          {({ fields }) =>
            fields.map((name, index) => (
              <FieldVideoItem
                key={name}
                name={name}
                onRemoveVideo={() => {
                  fields.remove(index);
                  form.blur('addVideo');
                }}
                setOpenVideoModal={setOpenVideoModal}
              />
            ))
          }
        </FieldArray>

        <div
          onClick={() => {
            form.blur('addVideo');
          }}
        >
          <FieldAddVideo
            id="addVideo"
            name="addVideo"
            accept={ACCEPT_VIDEOS}
            label={
              <span className={css.chooseImageText}>
                <span className={css.chooseImage}>
                  <FormattedMessage id="EditListingPhotosForm.addVideo" />
                </span>
                <span className={css.imageTypes}>
                  <FormattedMessage id="EditListingPhotosForm.videoExtensions" />
                </span>
                {videoUploadRequested && progress > 0 ? (
                  <span className={css.imageTypes}>{progress.toFixed(2)}%</span>
                ) : videoUploadRequested ? (
                  <FormattedMessage id="EditListingPhotosForm.videoUploadStart" />
                ) : null}
              </span>
            }
            type="file"
            disabled={videoUploadRequested}
            formApi={form}
            onVideoUploadHandler={onVideoUploadHandler}
            aspectWidth={aspectWidth}
            aspectHeight={aspectHeight}
          />
        </div>
        <PlayVideoModal openVideoModal={openVideoModal} setOpenVideoModal={setOpenVideoModal} />
      </div>
      {addVideoError && (
        <div className={classNames(css.error, css.videoError)}>{addVideoError}</div>
      )}
    </>
  );
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
  const [videoUploadRequested, setVideoUploadRequested] = useState(false);
  const [progress, setProgress] = useState(0);

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
          // Media kit props
          mediaKitImages,
          onMediaKitImageUpload,
          onRemoveMediaKitImage,
          mediaKitUploadInProgress,
          mediaKitUploadError,
          errors,
          listingImageConfig,
        } = formRenderProps;

        const intl = useIntl();
        const { listingType, transactionProcessAlias, unitType } = values;
        const filteredListingFieldsConfig = listingFieldsConfig.filter(elm => true);
        const hasCategories = selectableCategories && selectableCategories.length > 0;
        const showCategories = listingType && hasCategories;
        const { aspectWidth = 1, aspectHeight = 1, variantPrefix } = listingImageConfig;

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

        const images = values.images || [];
        const classes = classNames(css.root, className);
        const submitReady = (updated && pristine) || ready;
        const submitInProgress = updateInProgress;
        const submitDisabled =
          invalid ||
          disabled ||
          submitInProgress ||
          uploadInProgress ||
          mediaKitUploadInProgress ||
          videoUploadRequested;

        const onImageUploadHandler = async file => {
          if (file && onMediaKitImageUpload) {
            const tempId = `${file.name}_${Date.now()}`;
            const newImages = [
              ...images,
              {
                id: tempId,
                file,
              },
            ];
            form.change('images', newImages);
            const res = await onMediaKitImageUpload({ id: tempId, file });
            if (!res.error) {
              form.change(
                'images',
                newImages.map(img =>
                  img.id === tempId
                    ? {
                        ...img,
                        ...res.payload.uploadedImage,
                        imageId: res.payload.uploadedImage.id,
                      }
                    : img
                )
              );
            } else {
              form.change('images', newImages.filter(img => img.id !== tempId));
            }
          }
        };

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
              className={classNames(css.formField, css.displayName)}
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
              className={classNames(css.formField, css.aboutMe)}
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

            {/* Media Kit Images Section */}
            <div className={css.sectionContainer}>
              <H4 as="h2" className={css.sectionTitle}>
                <FormattedMessage id="ProfileDetailsForm.mediaKitTitle" />
              </H4>
              <p className={css.mediaKitDescription}>
                <FormattedMessage id="ProfileDetailsForm.mediaKitDescription" />
              </p>

              <div className={css.mediaKitImagesFieldArray}>
                <FieldArray name="images">
                  {({ fields }) =>
                    fields.map((name, index) => (
                      <FieldMediaKitImage
                        key={name}
                        name={name}
                        onRemoveImage={() => {
                          fields.remove(index);
                        }}
                        intl={intl}
                        aspectWidth={1}
                        aspectHeight={1}
                        variantPrefix="listing"
                      />
                    ))
                  }
                </FieldArray>

                <FieldAddMediaKitImage
                  id="addMediaKitImage"
                  name="addMediaKitImage"
                  accept={ACCEPT_IMAGES}
                  label={
                    <span className={css.chooseMediaKitImageText}>
                      <span className={css.chooseMediaKitImage}>
                        <FormattedMessage id="ProfileDetailsForm.addMediaKitImage" />
                      </span>
                      <span className={css.mediaKitImageTypes}>
                        <FormattedMessage id="ProfileDetailsForm.mediaKitImageTypes" />
                      </span>
                    </span>
                  }
                  type="file"
                  disabled={mediaKitUploadInProgress}
                  formApi={form}
                  onImageUploadHandler={onImageUploadHandler}
                  aspectWidth={1}
                  aspectHeight={1}
                />
              </div>

              <MediaKitUploadError
                uploadOverLimit={isUploadImageOverLimitError(mediaKitUploadError)}
                uploadError={mediaKitUploadError}
              />

              <p className={css.mediaKitTip}>
                <FormattedMessage id="ProfileDetailsForm.mediaKitTip" />
              </p>
            </div>

            {/* Video */}
            <VideoSection
              intl={intl}
              form={form}
              values={values}
              videoUploadRequested={videoUploadRequested}
              setVideoUploadRequested={setVideoUploadRequested}
              progress={progress}
              setProgress={setProgress}
              aspectWidth={aspectWidth}
              aspectHeight={aspectHeight}
            />

            <FieldLocationAutocompleteInput
              rootClassName={classNames(css.formField, css.input)}
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
                className={classNames(css.formField, css.categorySelect)}
                prefix={categoryPrefix}
                listingCategories={selectableCategories}
                formApi={form}
                intl={intl}
                allCategoriesChosen={allCategoriesChosen}
                setAllCategoriesChosen={setAllCategoriesChosen}
              />
            )}

            <div className={css.formField}>
              <AddListingFields
                listingType={listingType}
                listingFieldsConfig={filteredListingFieldsConfig}
                selectedCategories={pickSelectedCategories(values)}
                formId={formId}
                intl={intl}
              />
            </div>

            <div className={css.space} />

            <ProfileWizardFooter
              className={css.footer}
              updateInProgress={updateInProgress}
              handleSubmit={() => form.submit()}
              ready={submitReady}
              disabled={submitDisabled}
              submitButtonText={saveActionMsg}
              intl={intl}
            />
          </Form>
        );
      }}
    />
  );
};

export default ProfileDetailsForm;
