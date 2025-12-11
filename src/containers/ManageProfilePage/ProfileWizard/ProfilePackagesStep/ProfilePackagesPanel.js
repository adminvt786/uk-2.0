import classNames from 'classnames';
import { useIntl } from '../../../../util/reactIntl';
import { useSelector } from 'react-redux';
import { updateProfileInProgressSelector } from '../../ManageProfilePage.duck';
import { types as sdkTypes } from '../../../../util/sdkLoader';

import ProfilePackagesForm, { PACKAGE_TYPES } from './ProfilePackagesForm';
import css from './ProfilePackagesPanel.module.css';

const { Money } = sdkTypes;

/**
 * Get initial values from profile listing
 */
const getInitialValues = (profileListing, marketplaceCurrency, listingFields) => {
  const { packages } = profileListing?.attributes.publicData || {};

  // Get default values for dropdowns (first option)
  const deliveryMethodField = listingFields?.find(field => field.key === 'delivery_method');
  const turnaroundTimeField = listingFields?.find(field => field.key === 'turnaround_time');
  const defaultDeliveryMethod = deliveryMethodField?.enumOptions?.[0]?.option || '';
  const defaultTurnaroundTime = turnaroundTimeField?.enumOptions?.[1]?.option || '';

  return {
    packages: packages.map(pkg => ({
      ...pkg,
      price: pkg.price ? new Money(pkg.price, marketplaceCurrency) : null,
      delivery_method: pkg.delivery_method || defaultDeliveryMethod,
      turnaround_time: pkg.turnaround_time || defaultTurnaroundTime,
    })),
  };
};

/**
 * ProfilePackagesPanel component
 * Step 3 in the profile wizard for customizing package details
 */
const ProfilePackagesPanel = props => {
  const {
    className,
    rootClassName,
    profileListing,
    onSubmit,
    onBack,
    submitButtonText,
    config,
  } = props;

  const intl = useIntl();
  const updateInProgress = useSelector(updateProfileInProgressSelector);
  const classes = classNames(rootClassName || css.root, className);
  const marketplaceCurrency = config?.currency || 'USD';

  const listingFields = config?.listing?.listingFields;
  const initialValues = getInitialValues(profileListing, marketplaceCurrency, listingFields);

  const handleFormSubmit = values => {
    const { packages } = values;

    const whats_included = [];
    const add_ons = [];
    // Clean up packages data for submission
    const cleanedPackages = packages.map(pkg => {
      if (pkg.whats_included?.length > 0) {
        whats_included.push(...pkg.whats_included);
      }

      if (pkg.add_ons?.length > 0) {
        add_ons.push(...pkg.add_ons);
      }

      return {
        ...pkg,
        price: pkg.price?.amount,
      };
    });

    const prices = cleanedPackages.map(pkg => pkg.price).filter(p => p > 0);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

    const updateValues = {
      id: profileListing?.id?.uuid,
      price: new Money(minPrice, marketplaceCurrency),
      publicData: {
        packages: cleanedPackages,
        whats_included: Array.from(new Set(whats_included)),
        add_ons: Array.from(new Set(add_ons)),
      },
    };

    onSubmit(updateValues);
  };

  return (
    <div className={classes}>
      <p className={css.subtitle}>{intl.formatMessage({ id: 'ProfilePackagesPanel.subtitle' })}</p>

      <ProfilePackagesForm
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        onBack={onBack}
        submitButtonText={submitButtonText}
        updateInProgress={updateInProgress}
        marketplaceCurrency={marketplaceCurrency}
        listingFields={listingFields}
      />
    </div>
  );
};

export default ProfilePackagesPanel;
