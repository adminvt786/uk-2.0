import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IconsCollection,
  InlineTextButton,
  Menu,
  MenuContent,
  MenuItem,
  MenuLabel,
  Modal,
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
import { createResourceLocatorString } from '../../../util/routes';
import CampaignDetailsModal from './CampaignDetailsModal';
import FilterForm from './FilterForm';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { formatDateShort, isSameMonthYear } from '../../../util/dates';

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
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { title, description, publicData, price, state } = campaign.attributes || {};
  const [isCampaignOpen, setIsCampaignOpen] = useState(false);
  const {
    categoryLevel1,
    location,
    startDate,
    endDate,
    collaboration_exchange_type,
    creatror_requirements,
    travel_compensated,
    deliverable_type = [],
    hotel_name,
  } = publicData;
  const category = categories.find(elm => elm.id === categoryLevel1)?.name || '';
  const isClosed = collaboration_exchange_type === 'closed';
  const isPublished = state === 'published';
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
                Apply
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
                    {/* Edit option is always available */}
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
  const [location, setLocation] = useState();
  const [category, setCategory] = useState();
  const [deliverableType, setDeliverableType] = useState();
  const [hotelType, setHotelType] = useState();
  const categories = config?.categoryConfiguration?.categories || [];
  const [selectedCampaignsId, setSelectedCampaignsId] = useState(null);

  // Static options for dropdowns
  const locationOptions = [
    { label: 'Any location', option: 'any' },
    { label: 'Manchester', option: 'manchester' },
  ];
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
        />
      )}
    </div>
  );
}

export default HotelsRequestsSearchPage;
