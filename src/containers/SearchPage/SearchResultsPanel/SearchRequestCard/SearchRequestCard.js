import React, { useState } from 'react';
import classNames from 'classnames';

import { useIntl, FormattedMessage } from '../../../../util/reactIntl';
import { ensureListing } from '../../../../util/data';
import { formatMoney } from '../../../../util/currency';

import { IconArrowHead, Button } from '../../../../components';
import { formatDate } from '../../../ManageListingsPage/RequestListingCard/RequestListingCard';

import css from './SearchRequestCard.module.css';

/**
 * Search request card - displays a request listing in an expandable accordion format for search results
 *
 * @param {Object} props
 * @param {string} [props.className] - Custom class that extends the default class for the root element
 * @param {string} [props.rootClassName] - Custom class that overrides the default class for the root element
 * @param {propTypes.listing} props.listing - The listing
 * @param {Object} props.config - The configuration object
 * @param {function} props.onApply - Function to handle apply button click
 * @returns {JSX.Element} Search request card component
 */
const SearchRequestCard = props => {
  const { className, rootClassName, listing, config, onApply } = props;
  const [isExpanded, setIsExpanded] = useState(false);
  const intl = useIntl();

  const currentListing = ensureListing(listing);
  const { title = '', publicData = {}, description, price } = currentListing.attributes;
  const {
    categoryLevel1,
    location,
    startDate,
    endDate,
    collaboration_exchange_type,
    creatror_requirements,
    travel_compensated,
  } = publicData;
  const categories = config?.categoryConfiguration?.categories || [];
  const category = categories.find(elm => elm.id === categoryLevel1)?.name || '';

  const classes = classNames(rootClassName || css.root, className, {
    [css.expanded]: isExpanded,
  });

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleApplyClick = event => {
    event.stopPropagation();
    if (onApply) {
      onApply(currentListing.id);
    }
  };

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

        {/* Column 3: Apply Button & Arrow */}
        <div className={css.columnAction}>
          <Button className={css.applyButton} onClick={handleApplyClick}>
            <FormattedMessage id="SearchRequestCard.applyButton" />
          </Button>
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
              <FormattedMessage id="SearchRequestCard.descriptionLabel" />
            </span>
            <span className={css.detailValue}>{description}</span>
          </div>
          <div className={css.detailRow}>
            <span className={css.detailLabel}>
              <FormattedMessage id="SearchRequestCard.creatorRequirementsLabel" />
            </span>
            <span className={css.detailValue}>{creatror_requirements}</span>
          </div>
          <div className={css.detailRow}>
            <span className={css.detailLabel}>
              <FormattedMessage id="SearchRequestCard.collaborationTypeLabel" />
            </span>
            <span className={css.detailValue}>{collaboration_exchange_type}</span>
          </div>
          <div className={css.detailRow}>
            <span className={css.detailLabel}>
              <FormattedMessage id="SearchRequestCard.travelCompensatedLabel" />
            </span>
            <span className={css.detailValue}>{travel_compensated}</span>
          </div>
          {price?.amount > 0 && (
            <div className={css.detailRow}>
              <span className={css.detailLabel}>
                <FormattedMessage id="SearchRequestCard.priceLabel" />
              </span>
              <span className={css.detailValue}>{formatMoney(intl, price)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchRequestCard;
