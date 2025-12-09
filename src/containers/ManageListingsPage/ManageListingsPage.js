import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { compose } from 'redux';

import { useConfiguration } from '../../context/configurationContext';
import { useRouteConfiguration } from '../../context/routeConfigurationContext';
import { isScrollingDisabled, manageDisableScrolling } from '../../ducks/ui.duck';
import { isErrorNoPermissionToPostListings } from '../../util/errors';
import { FormattedMessage, useIntl } from '../../util/reactIntl';
import { pathByRouteName } from '../../util/routes';
import { propTypes } from '../../util/types';
import { NO_ACCESS_PAGE_POST_LISTINGS } from '../../util/urlHelpers';
import {
  hasPermissionToPostListings,
  isCreatorUserType,
  showCreateListingLinkForUser,
} from '../../util/userHelpers';

import {
  H3,
  LayoutSingleColumn,
  Page,
  PaginationLinks,
  PrimaryButton,
  UserNav,
} from '../../components';

import FooterContainer from '../../containers/FooterContainer/FooterContainer';
import TopbarContainer from '../../containers/TopbarContainer/TopbarContainer';

import RequestListingCard from './RequestListingCard/RequestListingCard';

import CreateRequestModal from './CreateRequestModal/CreateRequestModal';
import {
  closeListing,
  discardDraft,
  getOwnListingsById,
  openListing,
} from './ManageListingsPage.duck';
import css from './ManageListingsPage.module.css';

const Heading = props => {
  const { listingsAreLoaded, pagination, onOpenCreateRequestModal } = props;
  const hasResults = listingsAreLoaded && pagination.totalItems > 0;
  const hasNoResults = listingsAreLoaded && pagination.totalItems === 0;

  return hasResults ? (
    <div className={css.headingContainer}>
      <H3 as="h1" className={css.heading}>
        <FormattedMessage
          id="ManageListingsPage.youHaveListings"
          values={{ count: pagination.totalItems }}
        />
      </H3>
      <PrimaryButton className={css.createRequestButton} onClick={onOpenCreateRequestModal}>
        <FormattedMessage id="ManageListingsPage.createRequest" />
      </PrimaryButton>
    </div>
  ) : hasNoResults ? (
    <div className={css.noResultsContainer}>
      <H3 as="h1" className={css.headingNoListings}>
        <FormattedMessage id="ManageListingsPage.noResults" />
      </H3>
      <PrimaryButton className={css.createRequestButton} onClick={onOpenCreateRequestModal}>
        <FormattedMessage id="ManageListingsPage.createRequest" />
      </PrimaryButton>
    </div>
  ) : null;
};

const PaginationLinksMaybe = props => {
  const { listingsAreLoaded, pagination, page } = props;
  return listingsAreLoaded && pagination && pagination.totalPages > 1 ? (
    <PaginationLinks
      className={css.pagination}
      pageName="ManageListingsPage"
      pageSearchParams={{ page }}
      pagination={pagination}
    />
  ) : null;
};

/**
 * The ManageListingsPage component.
 *
 * @component
 * @param {Object} props
 * @param {propTypes.currentUser} props.currentUser - The current user
 * @param {propTypes.uuid} props.closingListing - The closing listing
 * @param {Object} props.closingListingError - The closing listing error
 * @param {propTypes.error} props.closingListingError.listingId - The closing listing id
 * @param {propTypes.error} props.closingListingError.error - The closing listing error
 * @param {propTypes.ownListing[]} props.listings - The listings
 * @param {function} props.onCloseListing - The onCloseListing function
 * @param {function} props.onDiscardDraft - The onDiscardDraft function
 * @param {function} props.onOpenListing - The onOpenListing function
 * @param {Object} props.openingListing - The opening listing
 * @param {propTypes.uuid} props.openingListing.uuid - The opening listing uuid
 * @param {Object} props.openingListingError - The opening listing error
 * @param {propTypes.uuid} props.openingListingError.listingId - The opening listing id
 * @param {propTypes.error} props.openingListingError.error - The opening listing error
 * @param {propTypes.pagination} props.pagination - The pagination
 * @param {boolean} props.queryInProgress - Whether the query is in progress
 * @param {propTypes.error} props.queryListingsError - The query listings error
 * @param {Object} props.queryParams - The query params
 * @param {boolean} props.scrollingDisabled - Whether the scrolling is disabled
 * @param {function} props.onManageDisableScrolling - The onManageDisableScrolling function
 * @returns {JSX.Element} manage listings page component
 */
export const ManageListingsPageComponent = props => {
  const [listingMenuOpen, setListingMenuOpen] = useState(null);
  const [createRequestModalOpen, setCreateRequestModalOpen] = useState(false);
  const [editListingId, setEditListingId] = useState(null);
  const history = useHistory();
  const routeConfiguration = useRouteConfiguration();
  const config = useConfiguration();
  const intl = useIntl();

  const {
    currentUser,
    closingListing,
    closingListingError,
    discardingDraft,
    discardingDraftError,
    listings = [],
    onCloseListing,
    onDiscardDraft,
    onOpenListing,
    openingListing,
    openingListingError,
    pagination,
    queryInProgress,
    queryListingsError,
    queryParams,
    scrollingDisabled,
    onManageDisableScrolling,
    createListingInProgress,
    createListingError,
    updateRequestInProgress,
    updateRequestError,
  } = props;

  useEffect(() => {
    if (isErrorNoPermissionToPostListings(openingListingError?.error)) {
      const noAccessPagePath = pathByRouteName('NoAccessPage', routeConfiguration, {
        missingAccessRight: NO_ACCESS_PAGE_POST_LISTINGS,
      });
      history.push(noAccessPagePath);
    }

    if (isCreatorUserType(currentUser)) {
      history.push(pathByRouteName('ManageProfilePage', routeConfiguration, {}));
    }
  }, [openingListingError, currentUser]);

  const onToggleMenu = listing => {
    setListingMenuOpen(listing);
  };

  const handleOpenListing = listingId => {
    const hasPostingRights = hasPermissionToPostListings(currentUser);

    if (!hasPostingRights) {
      const noAccessPagePath = pathByRouteName('NoAccessPage', routeConfiguration, {
        missingAccessRight: NO_ACCESS_PAGE_POST_LISTINGS,
      });
      history.push(noAccessPagePath);
    } else {
      onOpenListing(listingId);
    }
  };

  const hasPaginationInfo = !!pagination && pagination.totalItems != null;
  const listingsAreLoaded = !queryInProgress && hasPaginationInfo;

  const loadingResults = (
    <div className={css.messagePanel}>
      <H3 as="h2" className={css.heading}>
        <FormattedMessage id="ManageListingsPage.loadingOwnListings" />
      </H3>
    </div>
  );

  const queryError = (
    <div className={css.messagePanel}>
      <H3 as="h2" className={css.heading}>
        <FormattedMessage id="ManageListingsPage.queryError" />
      </H3>
    </div>
  );

  const showManageListingsLink = showCreateListingLinkForUser(config, currentUser);

  return (
    <Page
      title={intl.formatMessage({ id: 'ManageListingsPage.title' })}
      scrollingDisabled={scrollingDisabled}
    >
      <LayoutSingleColumn
        topbar={
          <>
            <TopbarContainer />
            <UserNav
              currentPage="ManageListingsPage"
              showManageListingsLink={showManageListingsLink}
            />
          </>
        }
        footer={<FooterContainer />}
      >
        {queryInProgress ? loadingResults : null}
        {queryListingsError ? queryError : null}

        <div className={css.listingPanel}>
          <Heading
            listingsAreLoaded={listingsAreLoaded}
            pagination={pagination}
            onOpenCreateRequestModal={() => setCreateRequestModalOpen(true)}
          />

          <div className={css.listingCards}>
            {listings.map(l => (
              <RequestListingCard
                key={l.id.uuid}
                listing={l}
                config={config}
                isMenuOpen={!!listingMenuOpen && listingMenuOpen.id.uuid === l.id.uuid}
                actionsInProgressListingId={openingListing || closingListing || discardingDraft}
                onToggleMenu={onToggleMenu}
                onOpenListing={handleOpenListing}
                onCloseListing={onCloseListing}
                onEditListing={listingId => {
                  setEditListingId(listingId);
                  setCreateRequestModalOpen(true);
                }}
              />
            ))}
          </div>

          {onManageDisableScrolling && createRequestModalOpen ? (
            <CreateRequestModal
              id="ManageListingsPageCreateRequest"
              isOpen={createRequestModalOpen}
              onManageDisableScrolling={onManageDisableScrolling}
              onCloseModal={() => setCreateRequestModalOpen(false)}
              config={config}
              inProgress={createListingInProgress || updateRequestInProgress}
              error={createListingError || updateRequestError}
              editListingId={editListingId}
            />
          ) : null}

          <PaginationLinksMaybe
            listingsAreLoaded={listingsAreLoaded}
            pagination={pagination}
            page={queryParams ? queryParams.page : 1}
          />
        </div>
      </LayoutSingleColumn>
    </Page>
  );
};

const mapStateToProps = state => {
  const { currentUser } = state.user;
  const {
    currentPageResultIds,
    pagination,
    queryInProgress,
    queryListingsError,
    queryParams,
    openingListing,
    openingListingError,
    closingListing,
    closingListingError,
    discardingDraft,
    discardingDraftError,
    createListingInProgress,
    createListingError,
    updateRequestInProgress,
    updateRequestError,
  } = state.ManageListingsPage;
  const listings = getOwnListingsById(state, currentPageResultIds);
  return {
    currentUser,
    currentPageResultIds,
    listings,
    pagination,
    queryInProgress,
    queryListingsError,
    queryParams,
    scrollingDisabled: isScrollingDisabled(state),
    openingListing,
    openingListingError,
    closingListing,
    closingListingError,
    discardingDraft,
    discardingDraftError,
    createListingInProgress,
    createListingError,
    updateRequestInProgress,
    updateRequestError,
  };
};

const mapDispatchToProps = dispatch => ({
  onCloseListing: listingId => dispatch(closeListing(listingId)),
  onOpenListing: listingId => dispatch(openListing(listingId)),
  onDiscardDraft: listingId => dispatch(discardDraft(listingId)),
  onManageDisableScrolling: (componentId, disableScrolling) =>
    dispatch(manageDisableScrolling(componentId, disableScrolling)),
});

const ManageListingsPage = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ManageListingsPageComponent);

export default ManageListingsPage;
