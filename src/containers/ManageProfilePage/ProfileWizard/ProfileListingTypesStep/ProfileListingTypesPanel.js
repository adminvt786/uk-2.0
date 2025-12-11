import { useState } from 'react';
import classNames from 'classnames';

import { useIntl } from '../../../../util/reactIntl';
import { useSelector } from 'react-redux';
import { updateProfileInProgressSelector } from '../../ManageProfilePage.duck';
import { PrimaryButton } from '../../../../components';

import css from './ProfileListingTypesPanel.module.css';

// Package type options
const PACKAGE_TYPES = [
  {
    id: 'content-creation',
    emoji: '📸',
    titleKey: 'ProfileListingTypesPanel.contentCreationTitle',
    descriptionKey: 'ProfileListingTypesPanel.contentCreationDescription',
    isDefault: true,
    isRequired: true,
  },
  {
    id: 'native-posting',
    emoji: '📲',
    titleKey: 'ProfileListingTypesPanel.nativePostingTitle',
    descriptionKey: 'ProfileListingTypesPanel.nativePostingDescription',
    isDefault: false,
    isRequired: false,
  },
  {
    id: 'amplified-sharing',
    emoji: '🚀',
    titleKey: 'ProfileListingTypesPanel.amplifiedSharingTitle',
    descriptionKey: 'ProfileListingTypesPanel.amplifiedSharingDescription',
    isDefault: false,
    isRequired: false,
  },
];

/**
 * Get initial values from the profile listing
 */
const getInitialValues = profileListing => {
  const { packages } = profileListing?.attributes?.publicData || {};

  if (packages && packages.length > 0) {
    return packages.map(pkg => pkg.id);
  }

  // Default: only the required package is selected
  return ['content-creation'];
};

/**
 * ProfileListingTypesPanel component
 * Step 2 in the profile wizard for selecting listing types/packages to offer
 *
 * @component
 * @param {Object} props
 * @param {string} [props.className] - Custom class
 * @param {string} [props.rootClassName] - Override root class
 * @param {Object} props.profileListing - The profile listing object
 * @param {Function} props.onSubmit - Submit handler
 * @param {Function} props.onBack - Back button handler
 * @param {string} props.submitButtonText - Text for submit button
 * @returns {JSX.Element}
 */
const ProfileListingTypesPanel = props => {
  const { className, rootClassName, profileListing, onSubmit, onBack, submitButtonText } = props;

  const intl = useIntl();
  const updateInProgress = useSelector(updateProfileInProgressSelector);
  const classes = classNames(rootClassName || css.root, className);

  const [selectedTypes, setSelectedTypes] = useState(() => getInitialValues(profileListing));

  const handleTypeToggle = typeId => {
    const packageType = PACKAGE_TYPES.find(t => t.id === typeId);

    // Cannot deselect required packages
    if (packageType?.isRequired) {
      return;
    }

    setSelectedTypes(prev => {
      if (prev.includes(typeId)) {
        return prev.filter(id => id !== typeId);
      }
      return [...prev, typeId];
    });
  };

  const handleSubmit = () => {
    const updateValues = {
      id: profileListing?.id?.uuid,
      publicData: {
        packages: PACKAGE_TYPES.filter(pkg => selectedTypes.includes(pkg.id)),
      },
    };
    onSubmit(updateValues);
  };

  return (
    <div className={classes}>
      <p className={css.subtitle}>
        {intl.formatMessage({ id: 'ProfileListingTypesPanel.subtitle' })}
      </p>

      <form onSubmit={handleSubmit}>
        <div className={css.packagesGrid}>
          {PACKAGE_TYPES.map(pkg => {
            const isSelected = selectedTypes.includes(pkg.id);
            const cardClasses = classNames(css.packageCard, {
              [css.packageCardSelected]: isSelected,
            });

            return (
              <div
                key={pkg.id}
                className={cardClasses}
                onClick={() => handleTypeToggle(pkg.id)}
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleTypeToggle(pkg.id);
                  }
                }}
              >
                {isSelected && (
                  <div className={css.checkmark}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="10" r="10" fill="currentColor" />
                      <path
                        d="M6 10L9 13L14 7"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}

                <div className={css.emojiIcon}>{pkg.emoji}</div>

                {pkg.isRequired && (
                  <span className={css.requiredBadge}>
                    {intl.formatMessage({ id: 'ProfileListingTypesPanel.requiredDefault' })}
                  </span>
                )}

                <h3 className={css.packageTitle}>{intl.formatMessage({ id: pkg.titleKey })}</h3>
                <p className={css.packageDescription}>
                  {intl.formatMessage({ id: pkg.descriptionKey })}
                </p>

                {pkg.isRequired && (
                  <>
                    <div className={css.divider} />
                    <p className={css.defaultText}>
                      {intl.formatMessage({ id: 'ProfileListingTypesPanel.includedByDefault' })}
                    </p>
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className={css.tipBox}>
          <span className={css.tipIcon}>💡</span>
          <span className={css.tipText}>
            {intl.formatMessage({ id: 'ProfileListingTypesPanel.tip' })}
          </span>
        </div>

        <div className={css.footer}>
          <div className={css.footerContent}>
            <div className={css.footerLeft}>
              <button
                type="button"
                className={css.backButton}
                onClick={onBack}
                disabled={updateInProgress}
              >
                {intl.formatMessage({ id: 'ProfileListingTypesPanel.back' })}
              </button>
              <p className={css.progressText}>
                {intl.formatMessage({ id: 'ProfileListingTypesPanel.progressSaved' })}
              </p>
            </div>
            <PrimaryButton
              type="button"
              className={css.continueButton}
              disabled={updateInProgress}
              inProgress={updateInProgress}
              onClick={handleSubmit}
            >
              {submitButtonText || intl.formatMessage({ id: 'ProfileListingTypesPanel.continue' })}
            </PrimaryButton>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileListingTypesPanel;
