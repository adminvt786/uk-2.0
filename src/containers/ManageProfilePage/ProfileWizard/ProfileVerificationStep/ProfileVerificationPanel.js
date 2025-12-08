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

        <Button className={css.payButton} onClick={() => {}}>
          <FormattedMessage id="ProfileVerificationPanel.payForVerification" />
        </Button>
      </div>

      {/* Divider */}
      <div className={css.divider}>
        <span className={css.dividerText}>
          <FormattedMessage id="ProfileVerificationPanel.or" />
        </span>
      </div>

      {/* Publish/Go to Profile Section */}
      <div className={css.publishSection}>
        <Button className={css.publishButton} onClick={handleActionClick} inProgress={inProgress}>
          {actionButtonText}
        </Button>

        {isDraft && (
          <p className={css.publishNote}>
            <FormattedMessage id="ProfileVerificationPanel.publishNote" />
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileVerificationPanel;
