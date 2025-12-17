import React, { useState } from 'react';
import classNames from 'classnames';
import ReactImageGallery from 'react-image-gallery';
import {
  IconArrowHead,
  ResponsiveImage,
  Modal,
  IconsCollection,
  Button,
} from '../../../components';
import { useIntl } from '../../../util/reactIntl';
import '../../ListingPage/ImageCarousel/image-gallery.css';
import css from './CampaignDetailsModal.module.css';
import { formatDate } from '../../ManageListingsPage/RequestListingCard/RequestListingCard';
import { formatMoney } from '../../../util/currency';
import { formatDateShort, isSameMonthYear } from '../../../util/dates';

const IMAGE_GALLERY_OPTIONS = {
  showPlayButton: false,
  disableThumbnailScroll: true,
  showThumbnails: false,
  showFullscreenButton: false,
  slideDuration: 350,
  showBullets: true,
  showNav: true,
  infinite: true,
  autoPlay: false,
};

const ImageCarousel = props => {
  const [currentIndex, setIndex] = useState(0);
  const intl = useIntl();
  const { images = [], imageVariants = ['listing-card', 'listing-card-2x'] } = props;
  const items = images.map((img, i) => {
    return {
      original: '',

      alt: intl.formatMessage(
        { id: 'ImageCarousel.imageAltText' },
        { index: i + 1, count: images.length }
      ),
      image: img, // Pass image object if available
    };
  });

  const renderItem = item => {
    // If we have an image object, use ResponsiveImage, otherwise use regular img
    if (item.image) {
      return (
        <div className={css.imageWrapper}>
          <div className={css.itemCentering}>
            <ResponsiveImage
              rootClassName={css.item}
              image={item.image}
              alt={item.alt}
              variants={imageVariants}
              sizes="(max-width: 767px) 100vw, 80vw"
            />
          </div>
        </div>
      );
    }

    // Fallback to regular img tag for URL strings
    return (
      <div className={css.imageWrapper}>
        <div className={css.itemCentering}>
          <img src={item.original} alt={item.alt} className={css.item} />
        </div>
      </div>
    );
  };

  const renderLeftNav = (onClick, disabled) => {
    return (
      <button
        className={css.navLeft}
        disabled={disabled}
        onClick={onClick}
        type="button"
        aria-label="Previous image"
      >
        <div className={css.navArrowWrapper}>
          <IconArrowHead direction="left" size="big" className={css.arrowHead} />
        </div>
      </button>
    );
  };

  const renderRightNav = (onClick, disabled) => {
    return (
      <button
        className={css.navRight}
        disabled={disabled}
        onClick={onClick}
        type="button"
        aria-label="Next image"
      >
        <div className={css.navArrowWrapper}>
          <IconArrowHead direction="right" size="big" className={css.arrowHead} />
        </div>
      </button>
    );
  };

  const handleSlide = currentIndex => {
    setIndex(currentIndex);
  };

  const naturalIndex = index => index + 1;

  // Render image index info. E.g. "4/12"
  const imageIndex =
    items.length > 0 ? (
      <span className={css.imageIndex}>
        {naturalIndex(currentIndex)}/{items.length}
      </span>
    ) : null;

  const classes = classNames(css.root);

  if (items.length === 0) {
    return <div className={css.noImage}>No images available</div>;
  }

  return (
    <>
      <ReactImageGallery
        additionalClass={classes}
        items={items}
        renderItem={renderItem}
        renderLeftNav={renderLeftNav}
        renderRightNav={renderRightNav}
        onSlide={handleSlide}
        {...IMAGE_GALLERY_OPTIONS}
        showBullets={items.length > 1}
      />
      {imageIndex}
    </>
  );
};

const DELIVERABLE_ICONS = {
  video: ['ugc_video', 'instagram_reels', 'tiktok'],
  photo: ['photos'],
  bag: ['long_form_content', 'stories'],
};

const getLabel = (options, value) => {
  return options.find(option => option.option === value)?.label || value;
};

const CampaignDetailsModal = props => {
  const {
    onClose,
    campaign,
    intl,
    listingFieldsConfig,
    categories,
    onManageDisableScrolling,
    showButtons = true,
    onApply,
  } = props;
  const { images } = campaign;
  const { title, publicData, price, description } = campaign.attributes || {};
  const {
    hotel_name,
    location,
    startDate,
    endDate,
    hotel_type,
    creatror_requirements,
    deliverable_type,
    categoryLevel1,
  } = publicData || {};
  const hotelTypeOptions =
    listingFieldsConfig.find(field => field.key === 'hotel_type')?.enumOptions || [];
  const deliverableTypeOptions =
    listingFieldsConfig.find(field => field.key === 'deliverable_type')?.enumOptions || [];
  const categoriesOptions = categories.map(category => ({
    label: category.name,
    option: category.id,
  }));
  const { address } = location || {};

  return (
    <Modal
      onManageDisableScrolling={onManageDisableScrolling}
      isOpen
      onClose={onClose}
      hideCloseButtonMessage={true}
      title="Campaign Details"
      closeButtonClassName={css.closeButton}
      containerClassNameMerge={css.modalContainer}
      contentClassName={css.content}
    >
      <ImageCarousel images={images} />
      <div className={css.contentWrapper}>
        <h3 className={css.title}>{title}</h3>
        <p className={css.hotelName}>{hotel_name}</p>
        <div className={css.features}>
          <div className={css.featureBox}>
            <label className={css.featureLabel}>
              <IconsCollection type="location" className={css.featureIcon} />
              <span>Location</span>
            </label>
            <span className={css.featureValue}>{address}</span>
          </div>
          <div className={css.featureBox}>
            <label className={css.featureLabel}>
              <IconsCollection type="calendar" className={css.featureIcon} />
              <span>Date</span>
            </label>
            <span className={css.featureValue}>
              {isSameMonthYear(startDate, endDate)
                ? formatDateShort(startDate, endDate)
                : `${formatDate(startDate, intl)} - ${formatDate(endDate, intl)}`}
            </span>
          </div>
          <div className={css.featureBox}>
            <label className={css.featureLabel}>
              <IconsCollection type="dollar" className={css.featureIcon} />
              <span>Compensation</span>
            </label>
            <span className={css.featureValue}>{formatMoney(intl, price)}</span>
          </div>
          <div className={css.featureBox}>
            <label className={css.featureLabel}>
              <IconsCollection type="bag" className={css.featureIcon} />
              <span>Type</span>
            </label>
            <span className={css.featureValue}>{getLabel(hotelTypeOptions, hotel_type)}</span>
          </div>
        </div>
        <div className={css.description}>
          <h4 className={css.descriptionLabel}>Campaign Overview</h4>
          <p className={css.descriptionValue}>{description}</p>
        </div>
        <div className={css.description}>
          <h4 className={css.descriptionLabel}>Campaign Goals</h4>
          <p className={css.descriptionValue}>{creatror_requirements}</p>
        </div>
        <div className={css.deliverables}>
          <h4 className={css.deliverablesLabel}>Deliverables</h4>
          <div className={css.deliverablesList}>
            {deliverable_type.map(deliverable => (
              <div className={css.deliverableBox}>
                <IconsCollection
                  type={Object.keys(DELIVERABLE_ICONS).find(key =>
                    DELIVERABLE_ICONS[key].includes(deliverable)
                  )}
                  className={css.deliverableIcon}
                />
                <span className={css.deliverableValue}>
                  {getLabel(deliverableTypeOptions, deliverable)}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className={css.description}>
          <h4 className={css.descriptionLabel}>Campaign Vibe</h4>
          <p className={css.descriptionValue}>{getLabel(categoriesOptions, categoryLevel1)}</p>
        </div>
        {showButtons ? <div className={css.divider} /> : null}
        {showButtons ? (
          <div className={css.buttons}>
            <Button rootClassName={css.applyButton} onClick={() => onApply(campaign.id)}>
              Apply Now
            </Button>
            <Button rootClassName={css.saveButton}>
              <IconsCollection type="heart" className={css.heartIcon} />
              Save for Later
            </Button>
          </div>
        ) : null}
      </div>
    </Modal>
  );
};

export default CampaignDetailsModal;
