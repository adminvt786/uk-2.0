import React, { useState, useEffect } from 'react';
import classNames from 'classnames';

import { FormattedMessage } from '../../../../util/reactIntl';
import { ACCOUNT_SETTINGS_PAGES } from '../../../../routing/routeConfiguration';
import {
  Avatar,
  InlineTextButton,
  LinkedLogo,
  Menu,
  MenuLabel,
  MenuContent,
  MenuItem,
  NamedLink,
} from '../../../../components';

import TopbarSearchForm from '../TopbarSearchForm/TopbarSearchForm';
import CustomLinksMenu from './CustomLinksMenu/CustomLinksMenu';

import css from './TopbarDesktop.module.css';
import { isCreatorUserType } from '../../../../util/userHelpers';

const SignupLink = () => {
  return (
    <NamedLink name="SignupPage" className={css.topbarLink}>
      <span className={css.topbarLinkLabel}>
        <FormattedMessage id="TopbarDesktop.signup" />
      </span>
    </NamedLink>
  );
};

const LoginLink = () => {
  return (
    <NamedLink name="LoginPage" className={css.topbarLink}>
      <span className={css.topbarLinkLabel}>
        <FormattedMessage id="TopbarDesktop.login" />
      </span>
    </NamedLink>
  );
};

const InboxLink = ({ notificationCount, inboxTab }) => {
  const notificationDot = notificationCount > 0 ? <div className={css.notificationDot} /> : null;
  return (
    <NamedLink className={css.topbarLink} name="InboxPage" params={{ tab: inboxTab }}>
      <span className={css.topbarLinkLabel}>
        <FormattedMessage id="TopbarDesktop.inbox" />
        {notificationDot}
      </span>
    </NamedLink>
  );
};

const ProfileMenu = ({ currentPage, currentUser, onLogout, showManageListingsLink, intl }) => {
  const isCreator = isCreatorUserType(currentUser);

  const currentPageClass = page => {
    const isAccountSettingsPage =
      page === 'AccountSettingsPage' && ACCOUNT_SETTINGS_PAGES.includes(currentPage);
    return currentPage === page || isAccountSettingsPage ? css.currentPage : null;
  };

  return (
    <Menu ariaLabel={intl.formatMessage({ id: 'TopbarDesktop.screenreader.profileMenu' })}>
      <MenuLabel className={css.profileMenuLabel} isOpenClassName={css.profileMenuIsOpen}>
        <Avatar className={css.avatar} user={currentUser} disableProfileLink />
      </MenuLabel>
      <MenuContent className={css.profileMenuContent}>
        {showManageListingsLink && !isCreator ? (
          <MenuItem key="ManageListingsPage">
            <NamedLink
              className={classNames(css.menuLink, currentPageClass('ManageListingsPage'))}
              name="ManageListingsPage"
            >
              <span className={css.menuItemBorder} />
              <FormattedMessage id="TopbarDesktop.yourListingsLink" />
            </NamedLink>
          </MenuItem>
        ) : null}
        <MenuItem key={isCreator ? 'ManageProfilePage' : 'ProfileSettingsPage'}>
          <NamedLink
            className={classNames(css.menuLink, currentPageClass('ProfileSettingsPage'))}
            name={isCreator ? 'ManageProfilePage' : 'ProfileSettingsPage'}
          >
            <span className={css.menuItemBorder} />
            <FormattedMessage id="TopbarDesktop.profileSettingsLink" />
          </NamedLink>
        </MenuItem>
        <MenuItem key="AccountSettingsPage">
          <NamedLink
            className={classNames(css.menuLink, currentPageClass('AccountSettingsPage'))}
            name="AccountSettingsPage"
          >
            <span className={css.menuItemBorder} />
            <FormattedMessage id="TopbarDesktop.accountSettingsLink" />
          </NamedLink>
        </MenuItem>
        <MenuItem key="logout">
          <InlineTextButton rootClassName={css.logoutButton} onClick={onLogout}>
            <span className={css.menuItemBorder} />
            <FormattedMessage id="TopbarDesktop.logout" />
          </InlineTextButton>
        </MenuItem>
      </MenuContent>
    </Menu>
  );
};

/**
 * Topbar for desktop layout
 *
 * @component
 * @param {Object} props
 * @param {string?} props.className add more style rules in addition to components own css.root
 * @param {string?} props.rootClassName overwrite components own css.root
 * @param {CurrentUser} props.currentUser API entity
 * @param {string?} props.currentPage
 * @param {boolean} props.isAuthenticated
 * @param {number} props.notificationCount
 * @param {Function} props.onLogout
 * @param {Function} props.onSearchSubmit
 * @param {Object?} props.initialSearchFormValues
 * @param {Object} props.intl
 * @param {Object} props.config
 * @param {boolean} props.showSearchForm
 * @param {boolean} props.showCreateListingsLink
 * @param {string} props.inboxTab
 * @returns {JSX.Element} search icon
 */
const TopbarDesktop = props => {
  const {
    className,
    config,
    customLinks,
    currentUser,
    currentPage,
    rootClassName,
    notificationCount = 0,
    intl,
    isAuthenticated,
    onLogout,
    onSearchSubmit,
    initialSearchFormValues = {},
    showSearchForm,
    showCreateListingsLink,
    inboxTab,
  } = props;
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle scroll effect for landing page
  useEffect(() => {
    const isLandingPage = currentPage === 'LandingPage';
    
    if (!isLandingPage) {
      setIsScrolled(true); // Always show white background on other pages
      return;
    }

    const handleScroll = () => {
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollPosition > 50);
    };

    // Set initial state
    handleScroll();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [currentPage]);

  const marketplaceName = config.marketplaceName;
  const authenticatedOnClientSide = mounted && isAuthenticated;
  const isAuthenticatedOrJustHydrated = isAuthenticated || !mounted;

  const giveSpaceForSearch = customLinks == null || customLinks?.length === 0;
  const classes = classNames(
    rootClassName || css.root,
    className,
    {
      [css.scrolled]: isScrolled,
      [css.transparent]: !isScrolled && currentPage === 'LandingPage',
    }
  );

  const inboxLinkMaybe = authenticatedOnClientSide ? (
    <InboxLink notificationCount={notificationCount} inboxTab={inboxTab} />
  ) : null;

  const profileMenuMaybe = authenticatedOnClientSide ? (
    <ProfileMenu
      currentPage={currentPage}
      currentUser={currentUser}
      onLogout={onLogout}
      showManageListingsLink={showCreateListingsLink}
      intl={intl}
    />
  ) : null;

  const signupLinkMaybe = isAuthenticatedOrJustHydrated ? null : <SignupLink />;
  const loginLinkMaybe = isAuthenticatedOrJustHydrated ? null : <LoginLink />;

  const searchFormMaybe = showSearchForm ? (
    <TopbarSearchForm
      className={classNames(css.searchLink, { [css.takeAvailableSpace]: giveSpaceForSearch })}
      desktopInputRoot={css.topbarSearchWithLeftPadding}
      onSubmit={onSearchSubmit}
      initialValues={initialSearchFormValues}
      appConfig={config}
    />
  ) : (
    <div
      className={classNames(css.spacer, css.topbarSearchWithLeftPadding, {
        [css.takeAvailableSpace]: giveSpaceForSearch,
      })}
    />
  );
  const mainLandingPage = currentPage === 'LandingPage';

  // Landing page menu items
  const landingPageMenuItems = mainLandingPage ? (
    <>
      <NamedLink name="LandingPage" className={css.landingMenuItem}>
        <span className={css.landingMenuItemLabel}>For Hotels</span>
      </NamedLink>
      <NamedLink name="LandingPage" className={css.landingMenuItem}>
        <span className={css.landingMenuItemLabel}>For Creators</span>
      </NamedLink>
      <NamedLink name="LandingPage" className={css.landingMenuItem}>
        <span className={css.landingMenuItemLabel}>Case Studies</span>
      </NamedLink>
      <NamedLink name="LandingPage" className={css.landingMenuItem}>
        <span className={css.landingMenuItemLabel}>About</span>
      </NamedLink>
    </>
  ) : null;

  // Landing page "Get Started" button
  const getStartedButton = mainLandingPage ? (
    <NamedLink name="SignupPage" className={css.getStartedButton}>
      <span className={css.getStartedText}>Get Started</span>
      <svg width="15" height="12" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.625 5.625L13.9583 5.625M13.9583 5.625L8.95833 10.625M13.9583 5.625L8.95833 0.625" stroke="black" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

    </NamedLink>
  ) : null;

  return (
    <nav
      className={classes}
      aria-label={intl.formatMessage({ id: 'TopbarDesktop.screenreader.topbarNavigation' })}
    >
      <LinkedLogo
        className={css.logoLink}
        layout="desktop"
        alt={intl.formatMessage({ id: 'TopbarDesktop.logo' }, { marketplaceName })}
        linkToExternalSite={config?.topbar?.logoLink}
        isScrolled={isScrolled}
      />
      {/* {searchFormMaybe} */}

      {mainLandingPage ? (
        <div className={css.topbarLinks}>
          {landingPageMenuItems}
        </div>
      ) : (
        <div className={css.topbarLinks}>
          <CustomLinksMenu
            currentPage={currentPage}
            customLinks={customLinks}
            intl={intl}
            hasClientSideContentReady={authenticatedOnClientSide || !isAuthenticatedOrJustHydrated}
            showCreateListingsLink={showCreateListingsLink && !isCreatorUserType(currentUser)}
          />
          {inboxLinkMaybe}
          {profileMenuMaybe}
          {loginLinkMaybe}
        </div>
      )}
      {mainLandingPage ? getStartedButton : signupLinkMaybe}
    </nav>
  );
};

export default TopbarDesktop;
