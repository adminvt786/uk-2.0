import { IconSpinner, LayoutSingleColumn, Page } from '../../components';
import { useIntl } from 'react-intl';
import TopbarContainer from '../TopbarContainer/TopbarContainer';
import FooterContainer from '../FooterContainer/FooterContainer';
import { isScrollingDisabled } from '../../ducks/ui.duck';
import { useSelector } from 'react-redux';
import {
  profileListingIdSelector,
  profileListingInProgressSelector,
  profileListingSelector,
} from './ManageProfilePage.duck';
import ProfileWizard from './ProfileWizard/ProfileWizard';
import css from './ManageProfilePage.module.css';

function ManageProfilePage(props) {
  const intl = useIntl();
  const scrollingDisabled = useSelector(isScrollingDisabled);
  const profileListingId = useSelector(profileListingIdSelector);
  const profileListing = useSelector(profileListingSelector);
  const profileListingInProgress = useSelector(profileListingInProgressSelector);

  // console.log('Profile Listing ID:', profileListingId);
  // console.log('Profile Listing:', profileListing);
  return (
    <Page
      title={intl.formatMessage({ id: 'ManageProfilePage.title' })}
      scrollingDisabled={scrollingDisabled}
    >
      <LayoutSingleColumn topbar={<TopbarContainer />}>
        {profileListingInProgress ? (
          <IconSpinner className={css.iconSpinner} />
        ) : (
          <ProfileWizard
            profileListing={profileListing}
            disabled={false}
            updateInProgress={false}
            errors={{}}
            intl={intl}
          />
        )}
      </LayoutSingleColumn>
    </Page>
  );
}

export default ManageProfilePage;
