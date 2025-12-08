import React from 'react';
import classNames from 'classnames';

import { formatMoney } from '../../../util/currency';
import { types as sdkTypes } from '../../../util/sdkLoader';

import { Heading } from '../../../components';
import { METHOD_OPTIONS } from '../../ManageProfilePage/ProfileWizard/ProfilePackagesStep/ProfilePackagesForm';

import css from './PackageDetailsMaybe.module.css';

const { Money } = sdkTypes;

/**
 * Get method label from METHOD_OPTIONS
 */
const getMethodLabel = method => {
  const option = METHOD_OPTIONS.find(opt => opt.key === method);
  return option ? option.label : method;
};

/**
 * PackageDetailsMaybe component - Displays selected package details in transaction
 *
 * @component
 * @param {Object} props
 * @param {string} [props.className] - Custom class name
 * @param {string} [props.rootClassName] - Root class name
 * @param {string} props.heading - Section heading
 * @param {string} props.packageId - Selected package ID from protectedData
 * @param {Object} props.listing - The listing object containing packages
 * @param {Object} props.intl - Intl object for formatting
 * @returns {JSX.Element|null}
 */
const PackageDetailsMaybe = props => {
  const { className, rootClassName, heading, packageId, listing, intl } = props;

  // Don't render if not showing or no packageId
  if (!packageId) {
    return null;
  }

  // Get packages from listing publicData
  const packages = listing?.attributes?.publicData?.packages || [];
  const selectedPackage = packages.find(pkg => pkg.id === packageId);

  // Don't render if package not found
  if (!selectedPackage) {
    return null;
  }

  const { title, description, method, price } = selectedPackage;

  // Format price
  const formattedPrice = price != null ? formatMoney(intl, new Money(price, 'USD')) : null;

  const methodLabel = getMethodLabel(method);

  const classes = classNames(rootClassName || css.root, className);

  return (
    <div className={classes}>
      {heading && (
        <Heading as="h3" rootClassName={css.heading}>
          {heading}
        </Heading>
      )}
      <div className={css.packageCard}>
        <div className={css.packageHeader}>
          <h4 className={css.packageTitle}>{title}</h4>
        </div>
        <div className={css.packageMeta}>
          {method && <span className={css.methodLabel}>{methodLabel}</span>}
          {formattedPrice && <span className={css.priceLabel}>{formattedPrice}</span>}
        </div>
        {description && <p className={css.packageDescription}>{description}</p>}
      </div>
    </div>
  );
};

export default PackageDetailsMaybe;
