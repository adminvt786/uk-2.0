import React from 'react';
import classNames from 'classnames';

import { FormattedMessage } from '../../../util/reactIntl';
import { formatMoney } from '../../../util/currency';
import { types as sdkTypes } from '../../../util/sdkLoader';

import { H4 } from '../../../components';

import css from './SectionPackages.module.css';
import { METHOD_OPTIONS } from '../../ManageProfilePage/ProfileWizard/ProfilePackagesStep/ProfilePackagesForm';

const { Money } = sdkTypes;

/**
 * Get method label from METHOD_OPTIONS
 */
const getMethodLabel = method => {
  const option = METHOD_OPTIONS.find(opt => opt.key === method);
  return option ? option.label : method;
};

/**
 * Single Package Card component
 */
const PackageCard = props => {
  const { pkg, intl, marketplaceCurrency } = props;

  const { title, description, method, price } = pkg;

  // Format price
  const formattedPrice = price ? formatMoney(intl, new Money(price, marketplaceCurrency)) : null;

  return (
    <div className={css.packageCard}>
      <div className={css.packageHeader}>
        <h3 className={css.packageTitle}>{title}</h3>
      </div>

      <div className={css.packageMeta}>
        {method && <span className={css.methodLabel}>{getMethodLabel(method)}</span>}
        {formattedPrice && <span className={css.priceLabel}>{formattedPrice}</span>}
      </div>

      {description && <p className={css.packageDescription}>{description}</p>}
    </div>
  );
};

/**
 * SectionPackages component - Displays packages from listing publicData
 *
 * @component
 * @param {Object} props
 * @param {string} [props.className] - Custom class name
 * @param {Array} props.packages - Array of package objects from publicData
 * @param {Object} props.intl - Intl object for formatting
 * @param {string} props.marketplaceCurrency - Default currency code
 * @returns {JSX.Element|null}
 */
const SectionPackages = props => {
  const { className, packages, intl, marketplaceCurrency = 'USD' } = props;

  // Don't render if no packages
  if (!packages || packages.length === 0) {
    return null;
  }

  const classes = classNames(css.root, className);

  return (
    <section className={classes}>
      <H4 as="h2" className={css.sectionTitle}>
        <FormattedMessage id="SectionPackages.title" />
      </H4>

      <div className={css.packagesGrid}>
        {packages.map((pkg, index) => (
          <PackageCard
            key={pkg.id || index}
            pkg={pkg}
            intl={intl}
            marketplaceCurrency={marketplaceCurrency}
          />
        ))}
      </div>
    </section>
  );
};

export default SectionPackages;
