import css from './ProfileWizardFooter.module.css';
import { PrimaryButton } from '../../../../components';
import classNames from 'classnames';

const ProfileWizardFooter = ({
  onBack,
  updateInProgress,
  handleSubmit,
  submitButtonText,
  intl,
  ready,
  disabled,
  className,
}) => {
  return (
    <div className={classNames(css.footer, className)}>
      <div className={css.footerContent}>
        <div className={css.footerLeft}>
          {onBack && (
            <>
              <button
                type="button"
                className={css.backButton}
                onClick={onBack}
                disabled={updateInProgress}
              >
                {intl.formatMessage({ id: 'ProfileListingTypesPanel.back' })}
              </button>
              <p className={css.progressText}>
                {intl.formatMessage({ id: 'ProfileListingTypesPanel.progressSaved' })}
              </p>
            </>
          )}
        </div>
        <PrimaryButton
          type="button"
          className={css.continueButton}
          disabled={disabled}
          ready={ready}
          inProgress={updateInProgress}
          onClick={handleSubmit}
        >
          {submitButtonText || intl.formatMessage({ id: 'ProfileListingTypesPanel.continue' })}
        </PrimaryButton>
      </div>
    </div>
  );
};

export default ProfileWizardFooter;
