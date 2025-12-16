import classNames from 'classnames';
import arrayMutators from 'final-form-arrays';
import { Field, Form as FinalForm } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { useIntl } from '../../../../util/reactIntl';
import { moneySubUnitAmountAtLeast } from '../../../../util/validators';
import {
  FieldCurrencyInput,
  FieldSelect,
  FieldTextInput,
  Form,
  PrimaryButton
} from '../../../../components';
import appSettings from '../../../../config/settings';
import css from './ProfilePackagesForm.module.css';

// Package type definitions with emojis
export const PACKAGE_TYPES = {
  'content-creation': {
    emoji: '📸',
    titleKey: 'ProfilePackagesPanel.contentCreationTitle',
    descriptionKey: 'ProfilePackagesPanel.contentCreationDescription',
  },
  'native-posting': {
    emoji: '📲',
    titleKey: 'ProfilePackagesPanel.nativePostingTitle',
    descriptionKey: 'ProfilePackagesPanel.nativePostingDescription',
  },
  'amplified-sharing': {
    emoji: '🚀',
    titleKey: 'ProfilePackagesPanel.amplifiedSharingTitle',
    descriptionKey: 'ProfilePackagesPanel.amplifiedSharingDescription',
  },
};

/**
 * Pill-style checkbox group for "What's Included" field
 */
const PillCheckboxGroup = ({ name, label, options }) => {
  return (
    <div className={css.pillCheckboxGroup}>
      {label && <label className={css.pillCheckboxLabel}>{label}</label>}
      <div className={css.pillCheckboxOptions}>
        {options.map(option => (
          <Field
            key={option.key}
            name={name}
            type="checkbox"
            value={option.key}
            render={({ input }) => {
              const isSelected = input.checked;
              return (
                <label
                  className={classNames(css.pillCheckbox, {
                    [css.pillCheckboxSelected]: isSelected,
                  })}
                >
                  <input {...input} className={css.pillCheckboxInput} />
                  <span className={css.pillCheckboxText}>{option.label}</span>
                </label>
              );
            }}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * Add-ons pill checkbox group with + when unselected, x when selected
 */
const AddOnsPillGroup = ({ name, label, options }) => {
  return (
    <div className={css.pillCheckboxGroup}>
      {label && <label className={css.pillCheckboxLabel}>{label}</label>}
      <div className={css.pillCheckboxOptions}>
        {options.map(option => (
          <Field
            key={option.key}
            name={name}
            type="checkbox"
            value={option.key}
            render={({ input }) => {
              const isSelected = input.checked;
              return (
                <label
                  className={classNames(css.addOnPill, {
                    [css.addOnPillSelected]: isSelected,
                  })}
                >
                  <input {...input} className={css.pillCheckboxInput} />
                  <span className={css.addOnIcon}>{isSelected ? '×' : '+'}</span>
                  <span className={css.pillCheckboxText}>{option.label}</span>
                </label>
              );
            }}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * Single Package Card with form fields
 */
const PackageFormCard = ({ pkg, name, intl, marketplaceCurrency, listingFields }) => {
  const packageConfig = PACKAGE_TYPES[pkg.id] || {};
  const whatsIncludedField = listingFields?.find(field => field.key === 'whats_included');
  const whatsIncludedOptions =
    whatsIncludedField?.enumOptions?.map(o => ({
      key: o.option,
      label: o.label,
    })) || [];
  const whatsIncludedLabel = whatsIncludedField?.showConfig?.label;

  const deliveryMethodField = listingFields?.find(field => field.key === 'delivery_method');
  const deliveryMethodOptions = deliveryMethodField?.enumOptions || [];
  const deliveryMethodLabel = deliveryMethodField?.showConfig?.label;

  const turnaroundTimeField = listingFields?.find(field => field.key === 'turnaround_time');
  const turnaroundTimeOptions = turnaroundTimeField?.enumOptions || [];
  const turnaroundTimeLabel = turnaroundTimeField?.showConfig?.label;

  const addOnsField = listingFields?.find(field => field.key === 'add_ons');
  const addOnsOptions =
    addOnsField?.enumOptions?.map(o => ({
      key: o.option,
      label: o.label,
    })) || [];
  const addOnsLabel = addOnsField?.showConfig?.label;

  const title = packageConfig.titleKey
    ? intl.formatMessage({ id: packageConfig.titleKey })
    : pkg.title || pkg.id;
  const description = packageConfig.descriptionKey
    ? intl.formatMessage({ id: packageConfig.descriptionKey })
    : pkg.description || '';

  return (
    <div className={css.packageFormCard}>
      {/* Header */}
      <div className={css.packageHeader}>
        <div className={css.packageHeaderLeft}>
          <div className={css.packageEmoji}>{packageConfig.emoji || '📦'}</div>
          <div className={css.packageHeaderInfo}>
            <h3 className={css.packageHeaderTitle}>{title}</h3>
            <p className={css.packageHeaderDescription}>{description}</p>
          </div>
        </div>
      </div>

      {/* Form content */}
      <div className={css.packageFormContent}>
        <FieldTextInput
          id={`${name}.title`}
          name={`${name}.title`}
          className={css.formField}
          type="text"
          label={intl.formatMessage({ id: 'ProfilePackagesPanel.titleLabel' })}
          placeholder={intl.formatMessage({ id: 'ProfilePackagesPanel.titlePlaceholder' })}
          disabled
        />

        <FieldTextInput
          id={`${name}.customDescription`}
          name={`${name}.description`}
          className={css.formField}
          type="textarea"
          label={
            <span className={css.descriptionLabelWrapper}>
              {intl.formatMessage({ id: 'ProfilePackagesPanel.descriptionLabel' })}
              <span className={css.descriptionHint}>
                {intl.formatMessage({ id: 'ProfilePackagesPanel.descriptionHint' })}
              </span>
            </span>
          }
          placeholder={intl.formatMessage({ id: 'ProfilePackagesPanel.descriptionPlaceholder' })}
        />

        {/* What's Included - pill checkboxes */}
        {whatsIncludedOptions.length > 0 && (
          <div className={css.formField}>
            <PillCheckboxGroup
              name={`${name}.whats_included`}
              label={whatsIncludedLabel}
              options={whatsIncludedOptions}
            />
          </div>
        )}

        {/* Delivery Method & Turnaround Time - same row */}
        {(deliveryMethodOptions.length > 0 || turnaroundTimeOptions.length > 0) && (
          <div className={css.formFieldRow}>
            {deliveryMethodOptions.length > 0 && (
              <FieldSelect
                id={`${name}.delivery_method`}
                name={`${name}.delivery_method`}
                className={css.formFieldHalf}
                label={deliveryMethodLabel}
              >
                {deliveryMethodOptions.map(opt => (
                  <option key={opt.option} value={opt.option}>
                    {opt.label}
                  </option>
                ))}
              </FieldSelect>
            )}
            {turnaroundTimeOptions.length > 0 && (
              <FieldSelect
                id={`${name}.turnaround_time`}
                name={`${name}.turnaround_time`}
                className={css.formFieldHalf}
                label={turnaroundTimeLabel}
              >
                {turnaroundTimeOptions.map(opt => (
                  <option key={opt.option} value={opt.option}>
                    {opt.label}
                  </option>
                ))}
              </FieldSelect>
            )}
          </div>
        )}

        {/* Price */}
        <FieldCurrencyInput
          id={`${name}.price`}
          name={`${name}.price`}
          className={css.formField}
          label={intl.formatMessage({ id: 'ProfilePackagesPanel.priceLabel' })}
          placeholder={intl.formatMessage({ id: 'ProfilePackagesPanel.pricePlaceholder' })}
          currencyConfig={appSettings.getCurrencyFormatting(marketplaceCurrency)}
          validate={moneySubUnitAmountAtLeast(
            intl.formatMessage({ id: 'ProfilePackagesPanel.priceTooLow' }),
            0
          )}
        />

        {/* Add-ons - pill checkboxes with +/x */}
        {addOnsOptions.length > 0 && (
          <div className={css.formField}>
            <AddOnsPillGroup name={`${name}.add_ons`} label={addOnsLabel} options={addOnsOptions} />
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * ProfilePackagesForm component - Form for Step 3 of the profile wizard.
 * Manages creator packages customization.
 *
 * @component
 * @param {Object} props
 * @param {string} [props.className] - Custom class
 * @param {Object} props.initialValues - The initial form values
 * @param {Function} props.onSubmit - The submit function
 * @param {Function} props.onBack - The back button handler
 * @param {string} props.submitButtonText - The submit button text
 * @param {boolean} props.updateInProgress - Whether the update is in progress
 * @param {string} props.marketplaceCurrency - The marketplace currency
 * @returns {JSX.Element}
 */
const ProfilePackagesForm = props => {
  const {
    className,
    initialValues,
    onSubmit,
    onBack,
    submitButtonText,
    updateInProgress,
    marketplaceCurrency = 'USD',
    listingFields,
  } = props;

  const intl = useIntl();
  const classes = classNames(css.root, className);

  return (
    <FinalForm
      initialValues={initialValues}
      onSubmit={onSubmit}
      mutators={{ ...arrayMutators }}
      render={({ handleSubmit, values }) => (
        <Form className={classes} onSubmit={handleSubmit}>
          <FieldArray name="packages">
            {({ fields }) => (
              <div className={css.packagesContainer}>
                {fields.map((name, index) => (
                  <PackageFormCard
                    key={name}
                    name={name}
                    pkg={values.packages?.[index] || {}}
                    intl={intl}
                    marketplaceCurrency={marketplaceCurrency}
                    listingFields={listingFields}
                  />
                ))}
              </div>
            )}
          </FieldArray>

          <div className={css.footer}>
            <div className={css.footerContent}>
              <div className={css.footerLeft}>
                <button
                  type="button"
                  className={css.backButton}
                  onClick={onBack}
                  disabled={updateInProgress}
                >
                  {intl.formatMessage({ id: 'ProfilePackagesPanel.back' })}
                </button>
                <p className={css.progressText}>
                  {intl.formatMessage({ id: 'ProfilePackagesPanel.progressSaved' })}
                </p>
              </div>
              <PrimaryButton
                type="submit"
                className={css.continueButton}
                disabled={updateInProgress}
                inProgress={updateInProgress}
              >
                {submitButtonText || intl.formatMessage({ id: 'ProfilePackagesPanel.continue' })}
              </PrimaryButton>
            </div>
          </div>
        </Form>
      )}
    />
  );
};

export default ProfilePackagesForm;
