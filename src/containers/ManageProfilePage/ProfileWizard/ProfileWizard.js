import React, { useState } from 'react';
import classNames from 'classnames';

// Import shared components
import { H3 } from '../../../components';

// Import modules from this directory
import ProfileStepIndicator from './ProfileStepIndicator/ProfileStepIndicator';
import ProfileDetailsPanel from './ProfileDetailsStep/ProfileDetailsPanel';
import css from './ProfileWizard.module.css';
import { useDispatch } from 'react-redux';
import { createProfileListingDraft, updateProfileListing } from '../ManageProfilePage.duck';
import { useConfiguration } from '../../../context/configurationContext';

const TOTAL_STEPS = 3;

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
  const {
    className,
    rootClassName,
    profileListing,
    disabled,
    onSubmit,
    updateInProgress,
    errors,
    intl,
  } = props;
  const config = useConfiguration();
  const [currentStep, setCurrentStep] = useState(1);
  const dispatch = useDispatch();
  const isDraft = profileListing?.attributes?.state === 'draft';
  const isPublished = profileListing?.attributes?.state === 'published';

  const classes = classNames(rootClassName || css.root, className);

  /**
   * Handle step submission - updates listing and moves to next step
   * @param {Object} values - Form values from the current step
   */
  const handleStepSubmit = async values => {
    try {
      if (currentStep === 1) {
        if (isPublished || isDraft) {
          await dispatch(
            updateProfileListing({ data: { ...values, id: profileListing.id.uuid }, config })
          );
        } else {
          await dispatch(createProfileListingDraft({ data: values, config }));
        }
      }

      if (currentStep < TOTAL_STEPS) {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {}
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
        // Placeholder for Step 2
        return (
          <div className={css.stepPlaceholder}>
            <p>{intl.formatMessage({ id: 'ProfileWizard.step2Placeholder' })}</p>
          </div>
        );
      case 3:
        // Placeholder for Step 3
        return (
          <div className={css.stepPlaceholder}>
            <p>{intl.formatMessage({ id: 'ProfileWizard.step3Placeholder' })}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className={classes}>
      <ProfileStepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} intl={intl} />

      <H3 as="h1" className={css.stepTitle}>
        {getStepTitle()}
      </H3>

      {renderCurrentStep()}

      {currentStep > 1 && (
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
