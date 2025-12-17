import React, { useState } from 'react';
import { Form as FinalForm } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import classNames from 'classnames';

// Import util modules
import { FormattedMessage, useIntl } from '../../../util/reactIntl';
import { isValidCurrencyForTransactionProcess } from '../../../util/fieldHelpers';
import {
  maxLength,
  required,
  composeValidators,
  autocompleteSearchRequired,
  autocompletePlaceSelected,
  moneySubUnitAmountAtLeast,
} from '../../../util/validators';

// Import shared components
import {
  Form,
  Button,
  FieldTextInput,
  FieldLocationAutocompleteInput,
  FieldSingleDatePicker,
  FieldCurrencyInput,
  H4,
} from '../../../components';

// Import reusable components from EditListingDetailsForm
import {
  FieldSelectCategory,
  AddListingFields,
  FieldSelectListingType,
} from '../../EditListingPage/EditListingWizard/EditListingDetailsPanel/EditListingDetailsForm';

import css from './CreateRequestForm.module.css';
import { identity } from '../../EditListingPage/EditListingWizard/EditListingDeliveryPanel/EditListingDeliveryForm';
import appSettings from '../../../config/settings';
import { FieldArray } from 'react-final-form-arrays';
import {
  FieldAddMediaKitImage,
  FieldMediaKitImage,
  MediaKitUploadError,
} from '../../ManageProfilePage/ProfileWizard/ProfileDetailsStep/ProfileDetailsForm';
import { isUploadImageOverLimitError } from '../../../util/errors';

const TITLE_MAX_LENGTH = 60;
const ACCEPT_IMAGES = 'image/*';

// Show various error messages
const ErrorMessage = props => {
  const { fetchErrors } = props;
  const { createRequestError } = fetchErrors || {};
  const errorMessage = createRequestError ? (
    <FormattedMessage id="CreateRequestForm.createRequestError" />
  ) : null;

  if (errorMessage) {
    return <p className={css.error}>{errorMessage}</p>;
  }
  return null;
};

/**
 * Form for creating a new request
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
 * @param {Function} props.pickSelectedCategories - The pick selected categories function
 * @param {Array<Object>} props.selectableListingTypes - The selectable listing types
 * @param {boolean} props.hasExistingListingType - Whether the listing type is existing
 * @param {Object} props.listingFieldsConfig - The listing fields config
 * @param {string} props.saveActionMsg - The save action message
 * @param {Function} props.onListingTypeChange - The listing type change function
 * @param {Function} props.onSubmit - The submit function
 * @returns {JSX.Element}
 */

const CreateRequestForm = props => {
  const [imageUploadRequested, setImageUploadRequested] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(null);
  const onImageUploadHandler = async ({ file, id }) => {
    try {
      const { onImageUpload, listingImageConfig } = props;
      if (file) {
        setImageUploadRequested(true);
        setImageUploadError(null);

        const response = await onImageUpload({ id, file }, listingImageConfig);
        if (!response.error) {
          setImageUploadError(response.error);
        } else {
          setImageUploadError(null);
        }
        setImageUploadRequested(false);
        return response;
      }
    } catch (error) {
      setImageUploadError(error);
      setImageUploadRequested(false);
      return error;
    }
  };

  return (
    <FinalForm
      {...props}
      mutators={{ ...arrayMutators }}
      render={formRenderProps => {
        const {
          className,
          disabled,
          ready,
          formId = 'CreateRequestForm',
          form: formApi,
          handleSubmit,
          invalid,
          pristine,
          marketplaceCurrency,
          selectableCategories,
          pickSelectedCategories,
          categoryPrefix,
          saveActionMsg,
          updated,
          updateInProgress,
          fetchErrors,
          listingFieldsConfig = [],
          values,
        } = formRenderProps;

        const intl = useIntl();
        const { listingType, transactionProcessAlias, unitType } = values;
        const [allCategoriesChosen, setAllCategoriesChosen] = useState(false);

        const titleRequiredMessage = intl.formatMessage({
          id: 'CreateRequestForm.titleRequired',
        });
        const maxLengthMessage = intl.formatMessage(
          { id: 'CreateRequestForm.maxLength' },
          { maxLength: TITLE_MAX_LENGTH }
        );

        // Verify if the selected listing type's transaction process supports the chosen currency.
        const isCompatibleCurrency = isValidCurrencyForTransactionProcess(
          transactionProcessAlias,
          marketplaceCurrency
        );

        const maxLength60Message = maxLength(maxLengthMessage, TITLE_MAX_LENGTH);

        const hasCategories = selectableCategories && selectableCategories.length > 0;
        const showCategories = listingType && hasCategories;

        const showTitle = hasCategories ? allCategoriesChosen : listingType;
        const showDescription = hasCategories ? allCategoriesChosen : listingType;
        const showListingFields = hasCategories ? allCategoriesChosen : listingType;

        const classes = classNames(css.root, className);
        const submitReady = (updated && pristine) || ready;
        const submitInProgress = updateInProgress;
        const hasMandatoryListingTypeData = listingType && transactionProcessAlias && unitType;
        const submitDisabled =
          invalid ||
          disabled ||
          submitInProgress ||
          !hasMandatoryListingTypeData ||
          !isCompatibleCurrency ||
          imageUploadRequested;

        const addressRequiredMessage = intl.formatMessage({
          id: 'CreateRequestForm.addressRequired',
        });
        const addressNotRecognizedMessage = intl.formatMessage({
          id: 'CreateRequestForm.addressNotRecognized',
        });

        const showPriceField = ['paid', 'both'].includes(values?.pub_shoutout);

        const priceRequired = required(
          intl.formatMessage({ id: 'CreateRequestForm.priceRequired' })
        );
        const minPriceRequired = moneySubUnitAmountAtLeast(
          intl.formatMessage({ id: 'CreateRequestForm.priceTooLow' }, { minPrice: 100 }),
          100
        );

        const onImageUpload = async file => {
          if (file) {
            const tempId = `${file.name}_${Date.now()}`;
            const oldImages = values.images || [];
            const newImages = [
              ...oldImages,
              {
                id: tempId,
                file,
              },
            ];
            formApi.change('images', newImages);
            const res = await onImageUploadHandler({ id: tempId, file });
            if (!res.error) {
              formApi.change(
                'images',
                newImages.map(img =>
                  img.id === tempId
                    ? {
                        ...img,
                        ...res.data,
                      }
                    : img
                )
              );
            } else {
              formApi.change('images', newImages.filter(img => img.id !== tempId));
            }
          }
        };

        return (
          <Form className={classes} onSubmit={handleSubmit}>
            <ErrorMessage fetchErrors={fetchErrors} />

            {showCategories && isCompatibleCurrency && (
              <FieldSelectCategory
                values={values}
                prefix={categoryPrefix}
                listingCategories={selectableCategories}
                formApi={formApi}
                intl={intl}
                allCategoriesChosen={allCategoriesChosen}
                setAllCategoriesChosen={setAllCategoriesChosen}
              />
            )}

            {showTitle && isCompatibleCurrency && (
              <FieldTextInput
                id={`${formId}title`}
                name="title"
                className={css.title}
                type="text"
                label={intl.formatMessage({ id: 'CreateRequestForm.title' })}
                placeholder={intl.formatMessage({ id: 'CreateRequestForm.titlePlaceholder' })}
                maxLength={TITLE_MAX_LENGTH}
                validate={composeValidators(required(titleRequiredMessage), maxLength60Message)}
                autoFocus
              />
            )}

            {showDescription && (
              <FieldTextInput
                id={`${formId}description`}
                name="description"
                className={css.description}
                type="textarea"
                label={intl.formatMessage({ id: 'CreateRequestForm.description' })}
                placeholder={intl.formatMessage({ id: 'CreateRequestForm.descriptionPlaceholder' })}
                validate={required(
                  intl.formatMessage({ id: 'CreateRequestForm.descriptionRequired' })
                )}
              />
            )}

            {showListingFields && (
              <FieldLocationAutocompleteInput
                rootClassName={css.input}
                inputClassName={css.locationAutocompleteInput}
                iconClassName={css.locationAutocompleteInputIcon}
                predictionsClassName={css.predictionsRoot}
                validClassName={css.validLocation}
                name="location"
                id={`${formId}.location`}
                label={intl.formatMessage({ id: 'CreateRequestForm.address' })}
                placeholder={intl.formatMessage({
                  id: 'CreateRequestForm.addressPlaceholder',
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
            )}

            {showListingFields && (
              <AddListingFields
                listingType={listingType}
                listingFieldsConfig={listingFieldsConfig}
                selectedCategories={pickSelectedCategories(values)}
                formId={formId}
                intl={intl}
              />
            )}

            {showPriceField && (
              <FieldCurrencyInput
                id="price"
                name="price"
                className={css.priceField}
                label={intl.formatMessage({ id: 'CreateRequestForm.priceLabel' })}
                placeholder={intl.formatMessage({ id: 'CreateRequestForm.pricePlaceholder' })}
                currencyConfig={appSettings.getCurrencyFormatting(marketplaceCurrency)}
                validate={composeValidators(priceRequired, minPriceRequired)}
              />
            )}

            {showListingFields && (
              <div className={css.dateFields}>
                <FieldSingleDatePicker
                  name="startDate"
                  id={`${formId}.startDate`}
                  className={css.dateField}
                  label={intl.formatMessage({ id: 'CreateRequestForm.startDateLabel' })}
                  placeholderText={intl.formatMessage({
                    id: 'CreateRequestForm.startDatePlaceholder',
                  })}
                  validate={required(
                    intl.formatMessage({ id: 'CreateRequestForm.startDateRequired' })
                  )}
                  useMobileMargins
                />
                <FieldSingleDatePicker
                  name="endDate"
                  id={`${formId}.endDate`}
                  className={css.dateField}
                  label={intl.formatMessage({ id: 'CreateRequestForm.endDateLabel' })}
                  placeholderText={intl.formatMessage({
                    id: 'CreateRequestForm.endDatePlaceholder',
                  })}
                  validate={required(
                    intl.formatMessage({ id: 'CreateRequestForm.endDateRequired' })
                  )}
                  useMobileMargins
                />
              </div>
            )}

            {showListingFields && (
              <div className={css.sectionContainer}>
                <H4 as="h2" className={css.sectionTitle}>
                  Photos
                </H4>

                <div className={css.addImagesFieldArray}>
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
                    id="addImage"
                    name="addImage"
                    accept={ACCEPT_IMAGES}
                    label={
                      <span className={css.chooseAddImageText}>
                        <span className={css.chooseAddImage}>
                          <FormattedMessage id="ProfileDetailsForm.addMediaKitImage" />
                        </span>
                        <span className={css.imageTypes}>
                          <FormattedMessage id="ProfileDetailsForm.mediaKitImageTypes" />
                        </span>
                      </span>
                    }
                    type="file"
                    disabled={imageUploadRequested}
                    formApi={formApi}
                    onImageUploadHandler={onImageUpload}
                    aspectWidth={1}
                    aspectHeight={1}
                  />
                </div>

                <MediaKitUploadError
                  uploadOverLimit={isUploadImageOverLimitError(imageUploadError)}
                  uploadError={imageUploadError}
                />

                <p className={css.mediaKitTip}>
                  <FormattedMessage id="ProfileDetailsForm.mediaKitTip" />
                </p>
              </div>
            )}
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

export default CreateRequestForm;
