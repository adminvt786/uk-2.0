import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { isScrollingDisabled } from '../../ducks/ui.duck';
import { FormattedMessage, injectIntl } from '../../util/reactIntl';
import { H3, LayoutSingleColumn, ListingCard, Page, PaginationLinks } from '../../components';
import FooterContainer from '../../containers/FooterContainer/FooterContainer';
import TopbarContainer from '../TopbarContainer/TopbarContainer';
import { getListingsById } from '../../ducks/marketplaceData.duck';
import css from './FavoriteListingsPage.module.css';
import { useConfiguration } from '../../context/configurationContext';
import { handleNavigateToMakeOfferPage } from '../ListingPage/ListingPage.shared';
import { useRouteConfiguration } from '../../context/routeConfigurationContext';
import { useHistory } from 'react-router-dom';
import { CampaignCard } from '../SearchPage/HotelsRequestsSearchPage/HotelsRequestsSearchPage';
import { isHotelUserType } from '../../util/userHelpers';

export const FavoriteListingsPageComponent = props => {
  const config = useConfiguration();
  const history = useHistory();
  const routes = useRouteConfiguration();
  const {
    listings,
    pagination,
    queryInProgress,
    queryFavoritesError,
    queryParams,
    scrollingDisabled,
    intl,
    isHotel,
  } = props;

  const hasPaginationInfo = !!pagination && pagination.totalItems != null;
  const listingsAreLoaded = !queryInProgress && hasPaginationInfo;
  const categories = config?.categoryConfiguration?.categories || [];

  const deliverableTypeOptions = config.listing.listingFields.find(
    elm => elm.key === 'deliverable_type'
  ).enumOptions;

  const loadingResults = (
    <div className={css.messagePanel}>
      <H3 as="h2" className={css.heading}>
        <FormattedMessage id="FavoriteListingsPage.loadingFavoriteListings" />
      </H3>
    </div>
  );

  const queryError = (
    <div className={css.messagePanel}>
      <H3 as="h2" className={css.heading}>
        <FormattedMessage id="FavoriteListingsPage.queryError" />
      </H3>
    </div>
  );

  const noResults =
    listingsAreLoaded && pagination.totalItems === 0 ? (
      <H3 as="h1" className={css.heading}>
        <FormattedMessage id="FavoriteListingsPage.noResults" />
      </H3>
    ) : null;

  const heading =
    listingsAreLoaded && pagination.totalItems > 0 ? (
      <H3 as="h1" className={css.heading}>
        <FormattedMessage
          id="FavoriteListingsPage.youHaveListings"
          values={{ count: pagination.totalItems }}
        />
      </H3>
    ) : (
      noResults
    );

  const page = queryParams ? queryParams.page : 1;
  const paginationLinks =
    listingsAreLoaded && pagination && pagination.totalPages > 1 ? (
      <PaginationLinks
        className={css.pagination}
        pageName="FavoriteListingsPage"
        pageSearchParams={{ page }}
        pagination={pagination}
      />
    ) : null;

  const title = intl.formatMessage({ id: 'FavoriteListingsPage.title' });

  const panelWidth = 62.5;
  // Render hints for responsive image
  const renderSizes = [
    `(max-width: 767px) 100vw`,
    `(max-width: 1920px) ${panelWidth / 2}vw`,
    `${panelWidth / 3}vw`,
  ].join(', ');

  const handleApply = listingId => {
    const getListing = id => listings.find(l => l.id.uuid === id.uuid);

    handleNavigateToMakeOfferPage({
      getListing,
      params: { id: listingId.uuid },
      history,
      routes,
    })();
  };

  return (
    <Page title={title} scrollingDisabled={scrollingDisabled}>
      <LayoutSingleColumn
        topbar={<TopbarContainer currentPage="FavoriteListingsPage" />}
        footer={<FooterContainer />}
      >
        {queryInProgress ? loadingResults : null}
        {queryFavoritesError ? queryError : null}
        <div className={css.listingPanel}>
          {heading}
          <div className={!isHotel ? css.campaignCards : css.listingCards}>
            {listings.map(l =>
              l.attributes.publicData.listingType === 'hotels' ? (
                <CampaignCard
                  onClick={() => {}}
                  key={l.id.uuid}
                  campaign={l}
                  categories={categories}
                  intl={intl}
                  deliverableTypeOptions={deliverableTypeOptions}
                  onApply={handleApply}
                  showMenu={false}
                />
              ) : (
                <ListingCard
                  className={css.listingCard}
                  key={l.id.uuid}
                  listing={l}
                  renderSizes={renderSizes}
                />
              )
            )}
          </div>
          {paginationLinks}
        </div>
      </LayoutSingleColumn>
    </Page>
  );
};

const mapStateToProps = state => {
  const {
    currentPageResultIds,
    pagination,
    queryInProgress,
    queryFavoritesError,
    queryParams,
  } = state.FavoriteListingsPage;
  const currentUser = state.user.currentUser;
  const isHotel = isHotelUserType(currentUser);
  const listings = getListingsById(state, currentPageResultIds);
  return {
    currentPageResultIds,
    listings,
    pagination,
    queryInProgress,
    queryFavoritesError,
    queryParams,
    scrollingDisabled: isScrollingDisabled(state),
    isHotel,
  };
};

const FavoriteListingsPage = compose(
  connect(mapStateToProps),
  injectIntl
)(FavoriteListingsPageComponent);

export default FavoriteListingsPage;
