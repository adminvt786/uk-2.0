import React from 'react';
import classNames from 'classnames';
import { useLocation, useHistory } from 'react-router-dom';

// Import shared components
import { H3 } from '../../../components';

// Import modules from this directory
import ProfileStepIndicator from './ProfileStepIndicator/ProfileStepIndicator';
import ProfileDetailsPanel from './ProfileDetailsStep/ProfileDetailsPanel';
import ProfileListingTypesPanel from './ProfileListingTypesStep/ProfileListingTypesPanel';
import ProfilePackagesPanel from './ProfilePackagesStep/ProfilePackagesPanel';
import ProfileVerificationPanel from './ProfileVerificationStep/ProfileVerificationPanel';
import css from './ProfileWizard.module.css';
import { useDispatch } from 'react-redux';
import {
  createProfileListingDraft,
  publishProfileListing,
  updateProfileListing,
} from '../ManageProfilePage.duck';
import { useConfiguration } from '../../../context/configurationContext';

const TOTAL_STEPS = 4;

/**
 * Get the current step from URL params, defaulting to 1
 * @param {string} search - URL search string
 * @returns {number}
 */
const getStepFromParams = search => {
  const params = new URLSearchParams(search);
  const stepParam = params.get('step');
  const step = stepParam ? parseInt(stepParam, 10) : 1;
  // Ensure step is valid (between 1 and TOTAL_STEPS)
  return step >= 1 && step <= TOTAL_STEPS ? step : 1;
};

/**
 * ProfileWizard component that manages the multi-step profile form.
 *
 * @component
 * @param {Object} props
 * @param {string} [props.className] - Custom class that extends the default class for the root element
 * @param {string} [props.rootClassName] - Custom class that overrides the default class for the root element
 * @param {Object} props.profileListing - The profile listing object
 * @param {boolean} props.disabled - Whether the form is disabled
 * @param {Function} props.onSubmit - The final submit function
 * @param {boolean} props.updateInProgress - Whether the update is in progress
 * @param {Object} props.errors - The errors object
 * @param {Object} props.intl - The intl object for translations
 * @returns {JSX.Element}
 */
const ProfileWizard = props => {
  const { className, rootClassName, profileListing, updateInProgress, intl } = props;
  const config = useConfiguration();
  const location = useLocation();
  const history = useHistory();
  const currentStep = getStepFromParams(location.search);
  const dispatch = useDispatch();
  const listingState = profileListing?.attributes?.state;
  const isDraft = listingState === 'draft';
  const isPublished = listingState === 'published';
  const isPendingApproval = listingState === 'pendingApproval';

  // Allow clicking on steps when listing is published or pending approval
  const allowStepClick = isPublished || isPendingApproval;

  const classes = classNames(rootClassName || css.root, className);

  /**
   * Update the step in URL params
   * @param {number} step
   */
  const setCurrentStep = step => {
    const params = new URLSearchParams(location.search);
    params.set('step', step.toString());
    history.replace({ pathname: location.pathname, search: params.toString() });
  };

  /**
   * Handle step submission - updates listing and moves to next step
   * @param {Object} values - Form values from the current step
   */
  const handleStepSubmit = async values => {
    try {
      const listingId = profileListing?.id?.uuid;
      const hasExistingListing = isPublished || isDraft;

      if (currentStep === 1 && !hasExistingListing) {
        // Create new draft if no listing exists
        await dispatch(createProfileListingDraft({ data: values, config }));
      } else if (currentStep === 4 && isDraft) {
        // Publish on final step if still in draft
        await dispatch(publishProfileListing({ listingId, config }));
      } else if (listingId) {
        // Update existing listing for steps 1, 2, or published step 3
        await dispatch(updateProfileListing({ data: { ...values, id: listingId }, config }));
      }

      if (currentStep < TOTAL_STEPS) {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      console.error('ProfileWizard step submission failed:', error);
    }
  };

  /**
   * Handle going back to previous step
   */
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  /**
   * Get the title for the current step
   */
  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return intl.formatMessage({ id: 'ProfileWizard.step1Title' });
      case 2:
        return intl.formatMessage({ id: 'ProfileWizard.step2Title' });
      case 3:
        return intl.formatMessage({ id: 'ProfileWizard.step3Title' });
      case 4:
        return intl.formatMessage({ id: 'ProfileWizard.step4Title' });
      default:
        return '';
    }
  };

  /**
   * Render the current step component
   */
  const renderCurrentStep = () => {
    const submitButtonText = isPublished
      ? intl.formatMessage({ id: 'ProfileWizard.update' })
      : intl.formatMessage({ id: 'ProfileWizard.nextStep' });

    switch (currentStep) {
      case 1:
        return (
          <ProfileDetailsPanel
            profileListing={profileListing}
            onSubmit={handleStepSubmit}
            submitButtonText={submitButtonText}
            config={config}
          />
        );
      case 2:
        return (
          <ProfileListingTypesPanel
            profileListing={profileListing}
            onSubmit={handleStepSubmit}
            onBack={handleBack}
            submitButtonText={submitButtonText}
          />
        );
      case 3:
        return (
          <ProfilePackagesPanel
            profileListing={profileListing}
            onSubmit={handleStepSubmit}
            onBack={handleBack}
            submitButtonText={submitButtonText}
            config={config}
          />
        );
      case 4:
        return (
          <ProfileVerificationPanel profileListing={profileListing} onSubmit={handleStepSubmit} />
        );
      default:
        return null;
    }
  };

  return (
    <main className={classes}>
      <ProfileStepIndicator
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        intl={intl}
        allowStepClick={allowStepClick}
        onStepClick={setCurrentStep}
        allStepsCompleted={allowStepClick}
      />

      <H3 as="h1" className={css.stepTitle}>
        {getStepTitle()}
      </H3>

      {renderCurrentStep()}

      {currentStep > 1 && currentStep !== 2 && (
        <button
          type="button"
          className={css.backButton}
          onClick={handleBack}
          disabled={updateInProgress}
        >
          {intl.formatMessage({ id: 'ProfileWizard.back' })}
        </button>
      )}
    </main>
  );
};

export default ProfileWizard;
