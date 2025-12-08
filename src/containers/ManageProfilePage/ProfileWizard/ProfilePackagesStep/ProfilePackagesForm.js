import classNames from 'classnames';
import arrayMutators from 'final-form-arrays';
import { Form as FinalForm } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

// Import util modules
import { FormattedMessage, useIntl } from '../../../../util/reactIntl';
import { required, moneySubUnitAmountAtLeast } from '../../../../util/validators';

// Import shared components
import {
  Button,
  FieldCurrencyInput,
  FieldSelect,
  FieldTextInput,
  Form,
  H4,
  IconClose,
} from '../../../../components';

// Import modules from this directory
import css from './ProfilePackagesForm.module.css';
import appSettings from '../../../../config/settings';

// Function to get default packages with translated content
const getDefaultPackages = intl => [
  {
    id: 'default-1',
    title: intl.formatMessage({ id: 'ProfilePackagesForm.defaultPackage1Title' }),
    description: intl.formatMessage({ id: 'ProfilePackagesForm.defaultPackage1Description' }),
    method: 'in-person',
    price: { amount: 0, currency: 'USD' },
    isDefault: true,
    isRequired: true, // Cannot be deleted
  },
  {
    id: 'default-2',
    title: intl.formatMessage({ id: 'ProfilePackagesForm.defaultPackage2Title' }),
    description: intl.formatMessage({ id: 'ProfilePackagesForm.defaultPackage2Description' }),
    method: 'online-content-promotion',
    price: { amount: 50000, currency: 'USD' },
    isDefault: true,
    isRequired: false,
  },
  {
    id: 'default-3',
    title: intl.formatMessage({ id: 'ProfilePackagesForm.defaultPackage3Title' }),
    description: intl.formatMessage({ id: 'ProfilePackagesForm.defaultPackage3Description' }),
    method: 'online-content-promotion',
    price: { amount: 30000, currency: 'USD' },
    isDefault: true,
    isRequired: false,
  },
  {
    id: 'default-4',
    title: intl.formatMessage({ id: 'ProfilePackagesForm.defaultPackage4Title' }),
    description: intl.formatMessage({ id: 'ProfilePackagesForm.defaultPackage4Description' }),
    method: 'in-person',
    price: { amount: 250000, currency: 'USD' },
    isDefault: true,
    isRequired: false,
  },
];

// Method options for the select field
const METHOD_OPTIONS = [
  { key: 'in-person', label: 'In-Person' },
  { key: 'online-content-promotion', label: 'Online / Content Promotion' },
];

/**
 * Error message component
 */
const ErrorMessage = props => {
  const { fetchErrors } = props;
  const { updateListingError, showListingsError } = fetchErrors || {};

  const errorMessage = updateListingError ? (
    <FormattedMessage id="ProfilePackagesForm.updateFailed" />
  ) : showListingsError ? (
    <FormattedMessage id="ProfilePackagesForm.showListingFailed" />
  ) : null;

  if (errorMessage) {
    return <p className={css.error}>{errorMessage}</p>;
  }
  return null;
};

/**
 * Single Package Card component
 */
const PackageCard = props => {
  const { name, index, pkg, onRemove, intl, marketplaceCurrency } = props;

  const isDefault = pkg?.isDefault;
  const isRequired = pkg?.isRequired;
  const canDelete = !isRequired;

  return (
    <div className={css.packageCard}>
      <div className={css.packageHeader}>
        <span className={css.packageNumber}>
          <FormattedMessage id="ProfilePackagesForm.packageNumber" values={{ number: index + 1 }} />
        </span>
        {canDelete && (
          <button type="button" className={css.removePackageButton} onClick={() => onRemove(index)}>
            <IconClose size="small" />
          </button>
        )}
      </div>

      <div className={css.packageContent}>
        {/* Title - read-only for default packages */}
        <FieldTextInput
          id={`${name}.title`}
          name={`${name}.title`}
          className={css.packageField}
          type="text"
          label={intl.formatMessage({ id: 'ProfilePackagesForm.titleLabel' })}
          placeholder={intl.formatMessage({ id: 'ProfilePackagesForm.titlePlaceholder' })}
          validate={required(intl.formatMessage({ id: 'ProfilePackagesForm.titleRequired' }))}
          disabled={isDefault}
        />

        {/* Description - read-only for default packages */}
        <FieldTextInput
          id={`${name}.description`}
          name={`${name}.description`}
          className={css.packageField}
          type="textarea"
          label={intl.formatMessage({ id: 'ProfilePackagesForm.descriptionLabel' })}
          placeholder={intl.formatMessage({ id: 'ProfilePackagesForm.descriptionPlaceholder' })}
          validate={required(intl.formatMessage({ id: 'ProfilePackagesForm.descriptionRequired' }))}
          disabled={isDefault}
        />

        <div className={css.packageFieldsRow}>
          {/* Method - editable */}
          <FieldSelect
            id={`${name}.method`}
            name={`${name}.method`}
            className={css.methodField}
            label={intl.formatMessage({ id: 'ProfilePackagesForm.methodLabel' })}
            validate={required(intl.formatMessage({ id: 'ProfilePackagesForm.methodRequired' }))}
          >
            <option value="" disabled>
              {intl.formatMessage({ id: 'ProfilePackagesForm.methodPlaceholder' })}
            </option>
            {METHOD_OPTIONS.map(option => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </FieldSelect>

          {/* Price - editable */}
          <FieldCurrencyInput
            id={`${name}.price`}
            name={`${name}.price`}
            className={css.priceField}
            label={intl.formatMessage({ id: 'ProfilePackagesForm.priceLabel' })}
            placeholder={intl.formatMessage({ id: 'ProfilePackagesForm.pricePlaceholder' })}
            currencyConfig={appSettings.getCurrencyFormatting(marketplaceCurrency)}
            validate={moneySubUnitAmountAtLeast(
              intl.formatMessage({ id: 'ProfilePackagesForm.priceTooLow' }),
              0
            )}
          />
        </div>
      </div>

      {isDefault && (
        <div className={css.defaultBadge}>
          <FormattedMessage id="ProfilePackagesForm.defaultPackage" />
        </div>
      )}
    </div>
  );
};

/**
 * ProfilePackagesForm component - Form for Step 2 of the profile wizard.
 * Manages creator packages/addons.
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
 * @param {Function} props.onSubmit - The submit function
 * @param {string} props.marketplaceCurrency - The marketplace currency
 * @returns {JSX.Element}
 */
const ProfilePackagesForm = props => {
  const { marketplaceCurrency = 'USD' } = props;

  return (
    <FinalForm
      {...props}
      mutators={{ ...arrayMutators }}
      render={formRenderProps => {
        const {
          className,
          disabled,
          ready,
          formId = 'ProfilePackagesForm',
          handleSubmit,
          invalid,
          pristine,
          saveActionMsg,
          updated,
          updateInProgress,
          fetchErrors,
          form,
          values,
        } = formRenderProps;

        const intl = useIntl();
        const classes = classNames(css.root, className);
        const submitReady = (updated && pristine) || ready;
        const submitInProgress = updateInProgress;
        const submitDisabled = invalid || disabled || submitInProgress;

        const handleAddPackage = () => {
          const newPackage = {
            id: `custom-${Date.now()}`,
            title: '',
            description: '',
            method: '',
            price: { amount: 0, currency: marketplaceCurrency },
            isDefault: false,
            isRequired: false,
          };
          form.mutators.push('packages', newPackage);
        };

        return (
          <Form className={classes} onSubmit={handleSubmit}>
            <ErrorMessage fetchErrors={fetchErrors} />

            <div className={css.sectionContainer}>
              <H4 as="h2" className={css.sectionTitle}>
                <FormattedMessage id="ProfilePackagesForm.packagesTitle" />
              </H4>
              <p className={css.sectionDescription}>
                <FormattedMessage id="ProfilePackagesForm.packagesDescription" />
              </p>

              <FieldArray name="packages">
                {({ fields }) => (
                  <div className={css.packagesContainer}>
                    {fields.map((name, index) => (
                      <PackageCard
                        key={name}
                        name={name}
                        index={index}
                        pkg={values.packages?.[index]}
                        onRemove={idx => fields.remove(idx)}
                        intl={intl}
                        marketplaceCurrency={marketplaceCurrency}
                      />
                    ))}
                    <button
                      type="button"
                      className={css.addPackageButton}
                      onClick={handleAddPackage}
                    >
                      <span className={css.addPackageIcon}>+</span>
                      <FormattedMessage id="ProfilePackagesForm.addPackage" />
                    </button>
                  </div>
                )}
              </FieldArray>
            </div>

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

// Export getDefaultPackages function for use in Panel
export { getDefaultPackages };
export default ProfilePackagesForm;
