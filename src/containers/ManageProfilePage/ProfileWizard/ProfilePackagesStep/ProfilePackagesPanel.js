import classNames from 'classnames';

// Import util modules
import { useIntl } from '../../../../util/reactIntl';

// Import modules from this directory
import ProfilePackagesForm, { getDefaultPackages } from './ProfilePackagesForm';
import css from './ProfilePackagesPanel.module.css';
import { types as sdkTypes } from '../../../../util/sdkLoader';
import { useSelector } from 'react-redux';
import { updateProfileInProgressSelector } from '../../ManageProfilePage.duck';

const { Money } = sdkTypes;

/**
 * Get initialValues for the form from the profile listing.
 *
 * @param {Object} profileListing - The profile listing object
 * @param {Object} intl - The intl object for translations
 * @returns {Object} initialValues object for the form
 */
const getInitialValues = (profileListing, intl, marketplaceCurrency) => {
  const { publicData } = profileListing?.attributes || {};
  const existingPackages = publicData?.packages;

  // If packages exist in listing, use them. Otherwise, use defaults.
  if (existingPackages && existingPackages.length > 0) {
    return {
      packages: existingPackages.map(elm => ({
        ...elm,
        price: new Money(elm.price, marketplaceCurrency),
      })),
    };
  }

  // Return default packages for new listings
  return { packages: getDefaultPackages(intl) };
};

/**
 * The ProfilePackagesPanel component.
 * This panel wraps the ProfilePackagesForm and handles the submit logic.
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
 * @param {Object} props.config - The marketplace config
 * @returns {JSX.Element}
 */
const ProfilePackagesPanel = props => {
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
  const updateProfileInProgress = useSelector(updateProfileInProgressSelector);
  const intl = useIntl();
  const classes = classNames(rootClassName || css.root, className);
  const marketplaceCurrency = config?.currency || 'USD';

  const initialValues = getInitialValues(profileListing, intl, marketplaceCurrency);

  return (
    <div className={classes}>
      <ProfilePackagesForm
        className={css.form}
        initialValues={initialValues}
        saveActionMsg={submitButtonText}
        onSubmit={values => {
          const { packages } = values;

          // Clean up packages data for submission
          const cleanedPackages = packages.map(pkg => ({
            id: pkg.id,
            title: pkg.title,
            description: pkg.description,
            method: pkg.method,
            price: pkg.price.amount,
            isDefault: pkg.isDefault || false,
            isRequired: pkg.isRequired || false,
          }));

          const prices = cleanedPackages.map(pkg => pkg.price);
          const minPrice = Math.min(...prices);

          // Prepare values for submission
          const updateValues = {
            id: profileListing?.id?.uuid,
            price: new Money(minPrice, marketplaceCurrency),
            publicData: {
              packages: cleanedPackages,
            },
          };

          onSubmit(updateValues);
        }}
        disabled={disabled}
        ready={ready}
        updated={panelUpdated}
        updateInProgress={updateProfileInProgress}
        fetchErrors={errors}
        marketplaceCurrency={marketplaceCurrency}
      />
    </div>
  );
};

export default ProfilePackagesPanel;
