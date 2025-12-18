import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  FavoriteButton,
  IconsCollection,
  InlineTextButton,
  Menu,
  MenuContent,
  MenuItem,
  MenuLabel,
  PaginationLinks,
  PrimaryButton,
  ResponsiveImage,
} from '../../../components';
import { useRouteConfiguration } from '../../../context/routeConfigurationContext';
import { formatMoney } from '../../../util/currency';
import { handleNavigateToMakeOfferPage } from '../../ListingPage/ListingPage.shared';
import {
  formatDate,
  ThreeDotsIcon,
} from '../../ManageListingsPage/RequestListingCard/RequestListingCard';
import css from './HotelsRequestsSearchPage.module.css';
import CampaignDetailsModal from './CampaignDetailsModal';
import FilterForm from './FilterForm';
import { FormattedMessage } from 'react-intl';
import { formatDateShort, isSameMonthYear } from '../../../util/dates';
import {
  LISTING_STATE_PENDING_APPROVAL,
  LISTING_STATE_PUBLISHED,
  LISTING_STATE_CLOSED,
} from '../../../util/types';

const getDeliverableTypeLabel = (deliverableTypeOptions, deliverableType) => {
  return (
    deliverableTypeOptions.find(elm => elm.option === deliverableType)?.label || deliverableType
  );
};

// Campaign Card Component
export const CampaignCard = ({
  campaign,
  categories,
  intl,
  onApply,
  deliverableTypeOptions,
  onClick,
  onEdit,
  showMenu = true,
  toggleOpenCloseListing,
  toggleOpenCloseInProgress,
}) => {
  const { title, publicData, price, state } = campaign.attributes || {};
  const [isCampaignOpen, setIsCampaignOpen] = useState(false);
  const {
    categoryLevel1,
    location,
    startDate,
    endDate,
    deliverable_type = [],
    hotel_name,
  } = publicData;
  const category = categories.find(elm => elm.id === categoryLevel1)?.name || '';
  const isClosed = state === LISTING_STATE_CLOSED;
  const isPublished = state === LISTING_STATE_PUBLISHED;
  const isPendingApproval = state === LISTING_STATE_PENDING_APPROVAL;
  return (
    <div className={css.campaignCard} onClick={onClick}>
      <div className={css.cardImage}>
        <ResponsiveImage
          image={campaign.images[0]}
          alt={title}
          variants={['listing-card', 'listing-card-2x']}
          sizes="(max-width: 767px) 100vw, 80vw"
        />
      </div>
      <div className={css.cardContent}>
        <FavoriteButton
          listingId={campaign.id}
          listingAuthor={campaign.author}
          isVisible={campaign.type !== 'ownListing'}
        />
        {isPendingApproval && (
          <div className={css.pendingApprovalBadge}>
            <FormattedMessage id="RequestListingCard.pendingApproval" />
          </div>
        )}
        <h3 className={css.cardTitle}>{title}</h3>
        <p className={css.cardSubtitle}>{hotel_name}</p>
        <div className={css.cardDetails}>
          <div className={css.detailItem}>
            <IconsCollection type="location" className={css.detailIcon} />
            <span>{location.address}</span>
          </div>
          <div className={css.detailItem}>
            <IconsCollection type="calendar" className={css.detailIcon} />
            <span>
              {' '}
              {isSameMonthYear(startDate, endDate)
                ? formatDateShort(startDate, endDate)
                : `${formatDate(startDate, intl)} - ${formatDate(endDate, intl)}`}
            </span>
          </div>
          <div className={css.detailItem}>
            <IconsCollection type="dollar" className={css.detailIcon} />
            <span>{formatMoney(intl, price)}</span>
          </div>
        </div>
        <div className={css.deliverables}>
          <IconsCollection type="deliverable" className={css.detailIcon} />
          <span className={css.deliverablesLabel}>Deliverables:</span>
          <div className={css.deliverableTags}>
            {deliverable_type?.map((item, index) => (
              <span key={index} className={css.deliverableTag}>
                {getDeliverableTypeLabel(deliverableTypeOptions, item)}
              </span>
            ))}
          </div>
        </div>
        <div className={css.cardFooter}>
          <div className={css.cardFooterContent}>
            {onApply && (
              <PrimaryButton
                type="button"
                rootClassName={css.applyButton}
                onClick={() => onApply(campaign.id)}
              >
                <FormattedMessage id="SearchRequestCard.applyButton" />
              </PrimaryButton>
            )}
            {showMenu && (
              <div className={css.menuWrapper}>
                <Menu
                  className={css.menu}
                  contentPosition="right"
                  useArrow={false}
                  onToggleActive={isOpen => {
                    const campaignOpen = isOpen ? campaign : null;
                    setIsCampaignOpen(campaignOpen);
                  }}
                  isOpen={isCampaignOpen}
                >
                  <MenuLabel className={css.menuLabel} isOpenClassName={css.menuLabelOpen}>
                    <div className={css.threeDotsWrapper}>
                      <ThreeDotsIcon className={css.threeDotsIcon} />
                    </div>
                  </MenuLabel>
                  <MenuContent rootClassName={css.menuContent}>
                    {/* Show Open option only when closed */}
                    {isClosed && !!toggleOpenCloseListing && (
                      <MenuItem key="open-listing">
                        <InlineTextButton
                          inProgress={toggleOpenCloseInProgress}
                          disabled={toggleOpenCloseInProgress}
                          rootClassName={css.menuItem}
                          onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleOpenCloseListing(true);
                          }}
                        >
                          <FormattedMessage id="RequestListingCard.openListing" />
                        </InlineTextButton>
                      </MenuItem>
                    )}

                    {/* Show Close option when published or pending approval */}
                    {isPublished && !!toggleOpenCloseListing && (
                      <MenuItem key="close-listing">
                        <InlineTextButton
                          rootClassName={css.menuItem}
                          onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleOpenCloseListing(false);
                          }}
                          inProgress={toggleOpenCloseInProgress}
                          disabled={toggleOpenCloseInProgress}
                        >
                          <FormattedMessage id="RequestListingCard.closeListing" />
                        </InlineTextButton>
                      </MenuItem>
                    )}

                    {/* Edit option is always available */}
                    {!!onEdit && (
                      <MenuItem key="edit-campaign">
                        <InlineTextButton
                          rootClassName={css.menuItem}
                          onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            onEdit();
                          }}
                        >
                          <FormattedMessage id="RequestListingCard.editListing" />
                        </InlineTextButton>
                      </MenuItem>
                    )}
                  </MenuContent>
                </Menu>
              </div>
            )}
          </div>
          <span className={css.categoryTag}>{category}</span>
        </div>
      </div>
    </div>
  );
};

function HotelsRequestsSearchPage(props) {
  const {
    campaigns,
    config,
    intl,
    onManageDisableScrolling,
    pagination,
    queryInProgress,
    validQueryParams,
    getHandleChangedValueFn,
  } = props;
  const routes = useRouteConfiguration();
  const history = useHistory();
  const [selectedCampaignsId, setSelectedCampaignsId] = useState(null);

  const categories = config?.categoryConfiguration?.categories || [];

  const deliverableTypeOptions = config.listing.listingFields.find(
    elm => elm.key === 'deliverable_type'
  ).enumOptions;
  const hotelTypeOptions = config.listing.listingFields.find(elm => elm.key === 'hotel_type')
    .enumOptions;

  const handleApply = listingId => {
    const getListing = id => campaigns.find(l => l.id.uuid === id.uuid);

    handleNavigateToMakeOfferPage({
      getListing,
      params: { id: listingId.uuid },
      history,
      routes,
    })();
  };

  const selectedCampaign = campaigns.find(campaign => campaign.id.uuid === selectedCampaignsId);

  const hasPaginationInfo = !!pagination && pagination.totalItems != null;
  const listingsAreLoaded = !queryInProgress && hasPaginationInfo;

  const paginationLinks =
    listingsAreLoaded && pagination && pagination.totalPages > 1 ? (
      <PaginationLinks
        className={css.pagination}
        pageName="SearchPageWithListingType"
        pageSearchParams={{ page }}
        pagePathParams={{ listingType: 'hotels' }}
        pagination={pagination}
      />
    ) : null;

  return (
    <div className={css.container}>
      <FilterForm
        categories={categories}
        deliverableTypeOptions={deliverableTypeOptions}
        hotelTypeOptions={hotelTypeOptions}
        getHandleChangedValueFn={getHandleChangedValueFn}
        validQueryParams={validQueryParams}
        intl={intl}
        appConfig={config}
      />

      <div className={css.campaignsSection}>
        <h2 className={css.campaignsTitle}>{campaigns.length} Campaigns Available</h2>
        <div className={css.campaignsList}>
          {campaigns.map(campaign => (
            <CampaignCard
              onClick={() => {
                setSelectedCampaignsId(campaign.id.uuid);
              }}
              key={campaign.id.uuid}
              campaign={campaign}
              categories={categories}
              intl={intl}
              deliverableTypeOptions={deliverableTypeOptions}
              onApply={handleApply}
              showMenu={false}
            />
          ))}
        </div>
        {paginationLinks}
      </div>
      {selectedCampaign && (
        <CampaignDetailsModal
          onManageDisableScrolling={onManageDisableScrolling}
          onClose={() => setSelectedCampaignsId(null)}
          campaign={selectedCampaign}
          intl={intl}
          listingFieldsConfig={config.listing.listingFields}
          categories={categories}
          onApply={handleApply}
        />
      )}
    </div>
  );
}

export default HotelsRequestsSearchPage;
