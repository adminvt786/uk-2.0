import classNames from 'classnames';

// Import util modules
import { FormattedMessage, useIntl } from '../../../../util/reactIntl';

// Import shared components
import { Button, ExternalLink, H4, IconCheckmark } from '../../../../components';

// Import modules from this directory
import css from './ProfileVerificationPanel.module.css';
import { useSelector } from 'react-redux';
import { publishListingInProgressSelector } from '../../ManageProfilePage.duck';
import { useHistory } from 'react-router-dom';
import { useRouteConfiguration } from '../../../../context/routeConfigurationContext';
import { createListingURL } from '../../../ManageListingsPage/ManageListingCard/ManageListingCard';

/**
 * ProfileVerificationPanel component - Panel for Step 3 of the profile wizard.
 * Displays verification badge option and publish/go to profile button.
 *
 * @component
 * @param {Object} props
 * @param {string} [props.className] - Custom class that extends the default class for the root element
 * @param {Object} props.profileListing - The profile listing object
 * @param {Function} props.onSubmit - Function to publish the listing
 * @param {boolean} props.publishInProgress - Whether publish is in progress
 * @param {Object} props.intl - The intl object for translations
 * @returns {JSX.Element}
 */
const ProfileVerificationPanel = props => {
  const { className, profileListing, onSubmit } = props;
  const intl = useIntl();
  const history = useHistory();
  const routeConfiguration = useRouteConfiguration();
  const publishListingInProgress = useSelector(publishListingInProgressSelector);
  const inProgress = publishListingInProgress;
  const classes = classNames(css.root, className);

  // Check if listing is in draft state
  const listingState = profileListing?.attributes?.state;
  const isDraft = listingState === 'draft';
  // Button text based on listing state
  const actionButtonText = isDraft
    ? intl.formatMessage({ id: 'ProfileVerificationPanel.publishProfile' })
    : intl.formatMessage({ id: 'ProfileVerificationPanel.goToProfile' });

  const handleActionClick = async () => {
    if (isDraft) {
      await onSubmit();
    }

    history.push(createListingURL(routeConfiguration, profileListing));
  };

  return (
    <div className={classes}>
      {/* Verification Badge Section */}
      <div className={css.verificationSection}>
        <div className={css.badgeIconWrapper}>
          <IconCheckmark rootClassName={css.badgeIcon} />
        </div>

        <H4 as="h2" className={css.verificationTitle}>
          <FormattedMessage id="ProfileVerificationPanel.getVerifiedBadge" />
        </H4>

        <p className={css.verificationDescription}>
          <FormattedMessage
            id="ProfileVerificationPanel.verificationDescription"
            values={{
              link: (
                <ExternalLink href="#" className={css.learnMoreLink}>
                  <FormattedMessage id="ProfileVerificationPanel.clickHere" />
                </ExternalLink>
              ),
            }}
          />
        </p>

        <Button
          className={css.payButton}
          onClick={() => history.push('/p/pricing#choose_your_plan')}
        >
          <FormattedMessage id="ProfileVerificationPanel.payForVerification" />
        </Button>
      </div>

      <div className={css.footer}>
        <div className={css.footerContent}>
          <div className={css.footerLeft}>
            <button
              type="button"
              className={css.backButton}
              onClick={props.onBack}
              disabled={inProgress}
            >
              {intl.formatMessage({ id: 'ProfilePackagesPanel.back' })}
            </button>
            <p className={css.progressText}>
              {intl.formatMessage({ id: 'ProfilePackagesPanel.progressSaved' })}
            </p>
          </div>
          <Button
            className={css.continueButton}
            onClick={handleActionClick}
            inProgress={inProgress}
            disabled={inProgress}
          >
            {actionButtonText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileVerificationPanel;
