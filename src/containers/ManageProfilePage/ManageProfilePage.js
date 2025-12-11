import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { IconSpinner, LayoutSingleColumn, Page } from '../../components';
import { isScrollingDisabled } from '../../ducks/ui.duck';
import TopbarContainer from '../TopbarContainer/TopbarContainer';
import { profileListingInProgressSelector, profileListingSelector } from './ManageProfilePage.duck';
import css from './ManageProfilePage.module.css';
import ProfileWizard from './ProfileWizard/ProfileWizard';

function ManageProfilePage(props) {
  const intl = useIntl();
  const scrollingDisabled = useSelector(isScrollingDisabled);
  const profileListing = useSelector(profileListingSelector);
  const profileListingInProgress = useSelector(profileListingInProgressSelector);

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
