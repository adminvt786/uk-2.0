import React, { useState } from 'react';
import css from './HotelsRequestsSearchPage.module.css';
import { IconsCollection, PrimaryButton } from '../../../components';
import { formatDate } from '../../ManageListingsPage/RequestListingCard/RequestListingCard';
import { formatMoney } from '../../../util/currency';

// Custom Dropdown Component
const FilterDropdown = ({ label, placeholder, options, value, onChange, icon }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = option => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className={css.filterItem}>
      <label className={css.filterLabel}>
        {icon && <IconsCollection type={icon} className={css.labelIcon} />}
        {label}
      </label>
      <div className={css.dropdownWrapper}>
        <button className={css.dropdownButton} onClick={() => setIsOpen(!isOpen)} type="button">
          <span className={css.dropdownText}>{value?.label || placeholder}</span>
          <span className={css.chevron}>{isOpen ? '▲' : '▼'}</span>
        </button>
        {isOpen && (
          <div className={css.dropdownMenu}>
            {options?.map((elm, index) => (
              <div key={elm.option} className={css.dropdownItem} onClick={() => handleSelect(elm)}>
                {elm.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Compensation Display Component
const CompensationDisplay = ({ label, value }) => {
  return (
    <div className={css.filterItem}>
      <label className={css.filterLabel}>$ {label}</label>
      <div className={css.compensationValue}>{value}</div>
    </div>
  );
};

// Campaign Card Component
const CampaignCard = ({ campaign, categories, intl }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { title, description, publicData, price } = campaign.attributes || {};
  const {
    categoryLevel1,
    location,
    startDate,
    endDate,
    collaboration_exchange_type,
    creatror_requirements,
    travel_compensated,
    deliverable_type,
    hotel_name,
  } = publicData;
  const category = categories.find(elm => elm.id === categoryLevel1)?.name || '';

  return (
    <div className={css.campaignCard}>
      <div className={css.cardImage}>
        <img
          src={
            campaign.image ||
            'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop'
          }
          alt={title}
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
              {formatDate(startDate, intl)} - {formatDate(endDate, intl)}
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
            {deliverable_type.map((item, index) => (
              <span key={index} className={css.deliverableTag}>
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className={css.cardFooter}>
          <PrimaryButton rootClassName={css.applyButton}>Apply</PrimaryButton>
          <span className={css.categoryTag}>{category}</span>
        </div>
      </div>
    </div>
  );
};

function HotelsRequestsSearchPage(props) {
  const [location, setLocation] = useState();
  const [category, setCategory] = useState();
  const [deliverableType, setDeliverableType] = useState();
  const [hotelType, setHotelType] = useState();

  const { campaigns, config, intl } = props;
  const categories = config?.categoryConfiguration?.categories || [];

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

  console.log('Campaigns:', config);
  return (
    <div className={css.container}>
      <div className={css.filterContainer}>
        <FilterDropdown
          label="Location"
          placeholder="Any location"
          icon="location"
          options={locationOptions}
          value={location}
          onChange={setLocation}
        />
        <FilterDropdown
          label="Category"
          placeholder="All categories"
          options={categories.map(cat => ({ option: cat.id, label: cat.name }))}
          value={category}
          onChange={setCategory}
          icon="category"
        />
        <FilterDropdown
          label="Deliverable Type"
          placeholder="All types"
          options={deliverableTypeOptions}
          value={deliverableType}
          onChange={setDeliverableType}
          icon="deliverable"
        />
        <FilterDropdown
          label="Hotel Type"
          placeholder="All types"
          options={hotelTypeOptions}
          value={hotelType}
          onChange={setHotelType}
          icon="hotel"
        />
        <CompensationDisplay label="Compensation" value="$0 - $10000" />
      </div>

      <div className={css.campaignsSection}>
        <h2 className={css.campaignsTitle}>{campaigns.length} Campaigns Available</h2>
        <div className={css.campaignsList}>
          {campaigns.map(campaign => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              categories={categories}
              intl={intl}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HotelsRequestsSearchPage;
