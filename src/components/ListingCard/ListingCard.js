import classNames from 'classnames';
import React from 'react';
import {
  AspectRatioWrapper,
  FavoriteButton,
  IconsCollection,
  ListingCardThumbnail,
  NamedLink,
  ResponsiveImage,
  ReviewRating,
} from '../../components';
import { useConfiguration } from '../../context/configurationContext';
import { requireListingImage } from '../../util/configHelpers';
import { formatMoney } from '../../util/currency';
import { ensureListing, ensureUser } from '../../util/data';
import { useIntl } from '../../util/reactIntl';
import { lazyLoadWithDimensions } from '../../util/uiHelpers';
import { createSlug } from '../../util/urlHelpers';
import { AUDIENCE } from '../IconsCollection/IconsCollection';
import css from './ListingCard.module.css';
import { useSelector } from 'react-redux';
import { currentUserTypeSelector } from '../../ducks/user.duck';

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
  const currentUserType = useSelector(currentUserTypeSelector);

  const { className, rootClassName, listing, renderSizes, setActiveListing, hidePrice } = props;

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
    ?.enumOptions?.find(elm => elm.option === size_total_following)?.label;

  const isVisible =
    (currentUserType === 'creator' && listingType === 'hotels') ||
    (currentUserType === 'travelbrand' && listingType === 'creators');
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

        <FavoriteButton
          listingId={currentListing.id}
          listingAuthor={author}
          isVisible={isVisible}
        />

        <div className={css.cardContent}>
          <div className={css.authorName}>{authorName}</div>
          <div className={css.locationName}>{locationDisplay}</div>
          {!hidePrice && (
            <div className={css.priceWrapper}>
              {intl.formatMessage(
                { id: 'ListingCard.packagesStartFrom' },
                { price: <span className={css.price}>{formattedPrice}</span> }
              )}
            </div>
          )}
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
