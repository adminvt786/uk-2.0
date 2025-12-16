import React from 'react';
import classNames from 'classnames';

import { useConfiguration } from '../../context/configurationContext';

import { FormattedMessage, useIntl } from '../../util/reactIntl';
import {
  displayPrice,
  isPriceVariationsEnabled,
  requireListingImage,
} from '../../util/configHelpers';
import { lazyLoadWithDimensions } from '../../util/uiHelpers';
import { formatMoney } from '../../util/currency';
import { ensureListing, ensureUser } from '../../util/data';
import { richText } from '../../util/richText';
import { createSlug } from '../../util/urlHelpers';
import { isBookingProcessAlias } from '../../transactions/transaction';
import { obfuscatedCoordinates } from '../../util/maps';

import {
  AspectRatioWrapper,
  NamedLink,
  ResponsiveImage,
  ListingCardThumbnail,
  Map,
  ReviewRating,
  IconsCollection,
} from '../../components';

import css from './ListingCard.module.css';
import { AUDIENCE } from '../IconsCollection/IconsCollection';

const MIN_LENGTH_FOR_LONG_WORDS = 10;

const priceData = (price, currency, intl) => {
  if (price && price.currency === currency) {
    const formattedPrice = formatMoney(intl, price);
    return { formattedPrice, priceTitle: formattedPrice };
  } else if (price) {
    return {
      formattedPrice: intl.formatMessage(
        { id: 'ListingCard.unsupportedPrice' },
        { currency: price.currency }
      ),
      priceTitle: intl.formatMessage(
        { id: 'ListingCard.unsupportedPriceTitle' },
        { currency: price.currency }
      ),
    };
  }
  return {};
};

const LazyImage = lazyLoadWithDimensions(ResponsiveImage, { loadAfterInitialRendering: 3000 });

/**
 * ListingCardImage
 * Component responsible for rendering the image part of the listing card.
 * It either renders the first image from the listing's images array with lazy loading,
 * or a stylized placeholder if images are disabled for the listing type.
 * Also wraps the image in a fixed aspect ratio container for consistent layout.
 * @component
 * @param {Object} props
 * @param {Object} props.currentListing listing entity with image data
 * @param {Function?} props.setActivePropsMaybe mouse enter/leave handlers for map highlighting
 * @param {string} props.title listing title for alt text
 * @param {string} props.renderSizes img/srcset size rules
 * @param {number} props.aspectWidth aspect ratio width
 * @param {number} props.aspectHeight aspect ratio height
 * @param {string} props.variantPrefix image variant prefix (e.g. "listing-card")
 * @param {boolean} props.showListingImage whether to show actual listing image or not
 * @param {Object?} props.style the background color for the listing card with no image
 * @returns {JSX.Element} listing image with fixed aspect ratio or fallback preview
 */
const ListingCardImage = props => {
  const {
    currentListing,
    setActivePropsMaybe,
    title,
    renderSizes,
    aspectWidth,
    aspectHeight,
    variantPrefix,
    showListingImage,
    style,
  } = props;

  const firstImage = currentListing.author.profileImage ? currentListing.author.profileImage : null;
  const variants = firstImage
    ? Object.keys(firstImage?.attributes?.variants).filter(k => k.startsWith(variantPrefix))
    : [];

  // Render the listing image only if listing images are enabled in the listing type
  return showListingImage ? (
    <AspectRatioWrapper
      className={css.aspectRatioWrapper}
      width={aspectWidth}
      height={aspectHeight}
    >
      <LazyImage
        rootClassName={css.rootForImage}
        alt={title}
        image={firstImage}
        variants={variants}
        sizes={renderSizes}
      />
    </AspectRatioWrapper>
  ) : (
    <ListingCardThumbnail
      style={style}
      listingTitle={title}
      className={css.aspectRatioWrapper}
      width={aspectWidth}
      height={aspectHeight}
    />
  );
};

/**
 * ListingCardMap
 * Component responsible for rendering a small map preview below the listing card image.
 * Shows obfuscated location if fuzzy maps are enabled.
 * @component
 * @param {Object} props
 * @param {Object} props.geolocation the listing's geolocation {lat, lng}
 * @param {Object} props.publicData the listing's publicData
 * @param {string} props.listingId the listing's id for cache key
 * @param {Object} props.mapsConfig maps configuration
 * @returns {JSX.Element|null} small map preview or null if no geolocation
 */
const ListingCardMap = props => {
  const { geolocation, publicData, listingId, mapsConfig } = props;

  if (!geolocation) {
    return null;
  }

  const address = publicData?.location?.address || '';
  const cacheKey = listingId ? `${listingId}_${geolocation.lat}_${geolocation.lng}` : null;

  const mapProps = mapsConfig?.fuzzy?.enabled
    ? { obfuscatedCenter: obfuscatedCoordinates(geolocation, mapsConfig.fuzzy.offset, cacheKey) }
    : { address, center: geolocation };

  // Truncate address for display
  const displayAddress = address
    ? address.length > 30
      ? `Around ${address.substring(0, 27)}...`
      : `Around ${address}`
    : '';

  return (
    <>
      <div className={css.mapWrapper}>
        <Map {...mapProps} useStaticMap={true} mapsConfig={mapsConfig} />
      </div>
      {displayAddress && <div className={css.locationText}>{displayAddress}</div>}
    </>
  );
};

/**
 * ListingCard
 *
 * @component
 * @param {Object} props
 * @param {string?} props.className add more style rules in addition to component's own css.root
 * @param {string?} props.rootClassName overwrite components own css.root
 * @param {Object} props.listing API entity: listing or ownListing
 * @param {string?} props.renderSizes for img/srcset
 * @param {Function?} props.setActiveListing
 * @param {boolean?} props.showAuthorInfo
 * @returns {JSX.Element} listing card to be used in search result panel etc.
 */
export const ListingCard = props => {
  const config = useConfiguration();
  const intl = props.intl || useIntl();

  const {
    className,
    rootClassName,
    listing,
    renderSizes,
    setActiveListing,
    showAuthorInfo = true,
  } = props;

  const classes = classNames(rootClassName || css.root, className);

  const currentListing = ensureListing(listing);
  const id = currentListing.id.uuid;
  const { title = '', price, publicData } = currentListing.attributes;
  const slug = createSlug(title);

  const author = ensureUser(listing.author);
  const authorName = author.attributes.profile.displayName;

  // Get formatted price for "Packages start from" display
  const { formattedPrice } = priceData(price, config.currency, intl);

  const { listingType, cardStyle, location, size_total_following } = publicData || {};
  const geolocation = currentListing.attributes.geolocation;
  const validListingTypes = config.listing.listingTypes;
  const foundListingTypeConfig = validListingTypes.find(conf => conf.listingType === listingType);
  const showListingImage = requireListingImage(foundListingTypeConfig);

  const {
    aspectWidth = 1,
    aspectHeight = 1,
    variantPrefix = 'listing-card',
  } = config.layout.listingImage;

  // Sets the listing as active in the search map when hovered (if the search map is enabled)
  const setActivePropsMaybe = setActiveListing
    ? {
        onMouseEnter: () => setActiveListing(currentListing.id),
        onMouseLeave: () => setActiveListing(null),
      }
    : null;

  const locationDisplay = location?.address;

  const rating = publicData?.rating || 5;

  const followingLabel = config.listing.listingFields
    .find(elm => elm.key === 'size_total_following')
    .enumOptions.find(elm => elm.option === size_total_following).label;

  return (
    <NamedLink className={classes} name="ListingPage" params={{ id, slug }}>
      <div className={css.imageWrapper}>
        <ListingCardImage
          renderSizes={renderSizes}
          title={title}
          currentListing={currentListing}
          config={config}
          setActivePropsMaybe={setActivePropsMaybe}
          aspectWidth={aspectWidth}
          aspectHeight={aspectHeight}
          variantPrefix={variantPrefix}
          style={cardStyle}
          showListingImage={showListingImage}
        />

       {/* <FavoriteButton listingId={id} listingAuthor={author} isVisible={true} /> */}

        <div className={css.cardContent}>
          <div className={css.authorName}>{authorName}</div>
          <div className={css.locationName}>{locationDisplay}</div>
          <div className={css.priceWrapper}>
            {intl.formatMessage(
              { id: 'ListingCard.packagesStartFrom' },
              { price: <span className={css.price}>{formattedPrice}</span> }
            )}
          </div>
          <div className={css.ratingWrapper}>
            <ReviewRating rating={rating} reviewStarClassName={css.ratingStar} />
            <div className={css.metaItem}>
              <IconsCollection type={AUDIENCE} />
              <span>{followingLabel}</span>
            </div>
          </div>
        </div>
      </div>
    </NamedLink>
  );
};

export default ListingCard;
