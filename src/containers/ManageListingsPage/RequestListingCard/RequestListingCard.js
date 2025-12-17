import React, { useState } from 'react';
import classNames from 'classnames';

import { useIntl, FormattedMessage } from '../../../util/reactIntl';
import { ensureOwnListing } from '../../../util/data';
import {
  LISTING_STATE_DRAFT,
  LISTING_STATE_PENDING_APPROVAL,
  LISTING_STATE_PUBLISHED,
  LISTING_STATE_CLOSED,
} from '../../../util/types';

import {
  IconArrowHead,
  Menu,
  MenuLabel,
  MenuContent,
  MenuItem,
  InlineTextButton,
} from '../../../components';

import css from './RequestListingCard.module.css';
import { formatMoney } from '../../../util/currency';

/**
 * Three dots menu icon
 */
export const ThreeDotsIcon = ({ className }) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="10" cy="4" r="2" />
    <circle cx="10" cy="10" r="2" />
    <circle cx="10" cy="16" r="2" />
  </svg>
);

/**
 * Format a date for display
 * @param {Date|string|number} date - The date to format (can be Unix timestamp in seconds or milliseconds)
 * @param {Object} intl - The intl object
 * @returns {string} The formatted date string
 */
export const formatDate = (date, intl) => {
  if (!date) return '-';

  // Handle Unix timestamp (seconds) - convert to milliseconds if needed
  let dateObj;
  if (typeof date === 'number') {
    // If timestamp is in seconds (less than year 3000 in milliseconds), convert to milliseconds
    dateObj = date < 100000000000 ? new Date(date * 1000) : new Date(date);
  } else {
    dateObj = date instanceof Date ? date : new Date(date);
  }

  return intl.formatDate(dateObj, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Get status label and class based on listing state
 * @param {string} state - The listing state
 * @returns {Object} The status info object
 */
const getStatusInfo = state => {
  switch (state) {
    case LISTING_STATE_PUBLISHED:
      return { labelId: 'RequestListingCard.statusPublished', className: 'statusPublished' };
    case LISTING_STATE_PENDING_APPROVAL:
      return { labelId: 'RequestListingCard.statusPending', className: 'statusPending' };
    case LISTING_STATE_DRAFT:
      return { labelId: 'RequestListingCard.statusDraft', className: 'statusDraft' };
    case LISTING_STATE_CLOSED:
      return { labelId: 'RequestListingCard.statusClosed', className: 'statusClosed' };
    default:
      return { labelId: 'RequestListingCard.statusUnknown', className: 'statusUnknown' };
  }
};

/**
 * Request listing card - displays a request listing in an expandable accordion format
 *
 * @param {Object} props
 * @param {string} [props.className] - Custom class that extends the default class for the root element
 * @param {string} [props.rootClassName] - Custom class that overrides the default class for the root element
 * @param {propTypes.ownListing} props.listing - The listing
 * @param {boolean} props.isMenuOpen - Whether the menu is open
 * @param {function} props.onToggleMenu - Function to toggle menu
 * @param {function} props.onOpenListing - Function to open a listing
 * @param {function} props.onCloseListing - Function to close a listing
 * @param {function} props.onEditListing - Function to edit a listing
 * @param {Object} props.actionsInProgressListingId - The listing id for which an action is in progress
 * @returns {JSX.Element} Request listing card component
 */
const RequestListingCard = props => {
  const {
    className,
    rootClassName,
    listing,
    config,
    isMenuOpen,
    onToggleMenu,
    onOpenListing,
    onCloseListing,
    onEditListing,
    actionsInProgressListingId,
  } = props;
  const [isExpanded, setIsExpanded] = useState(false);
  const intl = useIntl();

  const currentListing = ensureOwnListing(listing);
  const { title = '', state, publicData = {}, description, price } = currentListing.attributes;
  const {
    categoryLevel1,
    location,
    startDate,
    endDate,
    collaboration_exchange_type,
    creatror_requirements,
    travel_compensated,
  } = publicData;
  const categories = config.categoryConfiguration.categories || [];
  const category = categories.find(elm => elm.id === categoryLevel1)?.name || '';

  // Determine listing states
  const isClosed = state === LISTING_STATE_CLOSED;
  const isPendingApproval = state === LISTING_STATE_PENDING_APPROVAL;
  const isPublished = state === LISTING_STATE_PUBLISHED;

  // Get status info
  const statusInfo = getStatusInfo(state);

  const classes = classNames(rootClassName || css.root, className, {
    [css.expanded]: isExpanded,
  });

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleMenuClick = event => {
    event.stopPropagation();
  };

  const handleOpenListing = event => {
    event.preventDefault();
    event.stopPropagation();
    if (!actionsInProgressListingId && onOpenListing) {
      onToggleMenu(null);
      onOpenListing(currentListing.id);
    }
  };

  const handleCloseListing = event => {
    event.preventDefault();
    event.stopPropagation();
    if (!actionsInProgressListingId && onCloseListing) {
      onToggleMenu(null);
      onCloseListing(currentListing.id);
    }
  };

  const handleEditListing = event => {
    event.preventDefault();
    event.stopPropagation();
    if (onEditListing) {
      onToggleMenu(null);
      onEditListing(currentListing.id);
    }
  };

  const menuItemClasses = classNames(css.menuItem, {
    [css.menuItemDisabled]: !!actionsInProgressListingId,
  });

  return (
    <div className={classes}>
      {/* Collapsed Header - 3 columns */}
      <div className={css.header} onClick={handleToggle}>
        {/* Column 1: Title & Category */}
        <div className={css.column}>
          <div className={css.title}>{title}</div>
          <div className={css.subtitle}>{category}</div>
        </div>

        {/* Column 2: Location & Dates */}
        <div className={css.column}>
          <div className={css.location}>{location?.address}</div>
          <div className={css.dates}>
            {formatDate(startDate, intl)} - {formatDate(endDate, intl)}
          </div>
        </div>

        {/* Column 3: Status */}
        <div className={css.columnStatus}>
          <span className={classNames(css.status, css[statusInfo.className])}>
            <FormattedMessage id={statusInfo.labelId} />
          </span>

          {/* Three dots menu */}
          <div className={css.menuWrapper} onClick={handleMenuClick}>
            <Menu
              className={css.menu}
              contentPosition="left"
              useArrow={false}
              onToggleActive={isOpen => {
                const listingOpen = isOpen ? currentListing : null;
                onToggleMenu(listingOpen);
              }}
              isOpen={isMenuOpen}
            >
              <MenuLabel className={css.menuLabel} isOpenClassName={css.menuLabelOpen}>
                <div className={css.threeDotsWrapper}>
                  <ThreeDotsIcon className={css.threeDotsIcon} />
                </div>
              </MenuLabel>
              <MenuContent rootClassName={css.menuContent}>
                {/* Show Open option only when closed */}
                {isClosed && (
                  <MenuItem key="open-listing">
                    <InlineTextButton rootClassName={menuItemClasses} onClick={handleOpenListing}>
                      <FormattedMessage id="RequestListingCard.openListing" />
                    </InlineTextButton>
                  </MenuItem>
                )}

                {/* Show Close option when published or pending approval */}
                {isPublished && (
                  <MenuItem key="close-listing">
                    <InlineTextButton rootClassName={menuItemClasses} onClick={handleCloseListing}>
                      <FormattedMessage id="RequestListingCard.closeListing" />
                    </InlineTextButton>
                  </MenuItem>
                )}

                {/* Edit option is always available */}
                <MenuItem key="edit-listing">
                  <InlineTextButton rootClassName={menuItemClasses} onClick={handleEditListing}>
                    <FormattedMessage id="RequestListingCard.editListing" />
                  </InlineTextButton>
                </MenuItem>
              </MenuContent>
            </Menu>
          </div>

          <IconArrowHead
            className={classNames(css.arrowIcon, { [css.arrowIconExpanded]: isExpanded })}
            direction="down"
            size="small"
          />
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className={css.expandedContent}>
          <div className={css.detailRow}>
            <span className={css.detailLabel}>
              <FormattedMessage id="RequestListingCard.descriptionLabel" />
            </span>
            <span className={css.detailValue}>{description}</span>
          </div>
          <div className={css.detailRow}>
            <span className={css.detailLabel}>
              <FormattedMessage id="RequestListingCard.creatorRequirementsLabel" />
            </span>
            <span className={css.detailValue}>{creatror_requirements}</span>
          </div>
          <div className={css.detailRow}>
            <span className={css.detailLabel}>
              <FormattedMessage id="RequestListingCard.collaborationTypeLabel" />
            </span>
            <span className={css.detailValue}>{collaboration_exchange_type}</span>
          </div>
          <div className={css.detailRow}>
            <span className={css.detailLabel}>
              <FormattedMessage id="RequestListingCard.travelCompensatedLabel" />
            </span>
            <span className={css.detailValue}>{travel_compensated}</span>
          </div>
          {price?.amount > 0 && (
            <div className={css.detailRow}>
              <span className={css.detailLabel}>
                <FormattedMessage id="RequestListingCard.priceLabel" />
              </span>
              <span className={css.detailValue}>{formatMoney(intl, price)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RequestListingCard;
