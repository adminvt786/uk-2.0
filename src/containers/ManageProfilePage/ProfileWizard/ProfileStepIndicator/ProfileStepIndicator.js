import React from 'react';
import classNames from 'classnames';

import css from './ProfileStepIndicator.module.css';

/**
 * ProfileStepIndicator component that shows the current step progress.
 *
 * @component
 * @param {Object} props
 * @param {string} [props.className] - Custom class that extends the default class for the root element
 * @param {string} [props.rootClassName] - Custom class that overrides the default class for the root element
 * @param {number} props.currentStep - The current active step (1-indexed)
 * @param {number} props.totalSteps - The total number of steps
 * @param {Object} props.intl - The intl object for translations
 * @param {Function} [props.onStepClick] - Optional callback when a step is clicked
 * @param {boolean} [props.allowStepClick] - Whether clicking on steps is allowed
 * @param {boolean} [props.allStepsCompleted] - Whether all steps should show as completed
 * @returns {JSX.Element}
 */
const ProfileStepIndicator = props => {
  const {
    className,
    rootClassName,
    currentStep,
    totalSteps,
    intl,
    onStepClick,
    allowStepClick,
    allStepsCompleted,
  } = props;

  const classes = classNames(rootClassName || css.root, className);

  return (
    <div className={classes}>
      <div className={css.stepInfo}>
        <span className={css.stepText}>
          {intl.formatMessage(
            { id: 'ProfileStepIndicator.stepProgress' },
            { currentStep, totalSteps }
          )}
        </span>
      </div>

      <div className={css.progressBar}>
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = allStepsCompleted || stepNumber < currentStep;
          const isClickable = allowStepClick && stepNumber !== currentStep;

          const handleClick = () => {
            if (isClickable && onStepClick) {
              onStepClick(stepNumber);
            }
          };

          return (
            <div
              key={stepNumber}
              className={classNames(css.step, {
                [css.stepActive]: isActive && !allStepsCompleted,
                [css.stepCompleted]: isCompleted,
              })}
            >
              <div
                className={classNames(css.stepDot, {
                  [css.stepClickable]: isClickable,
                })}
                onClick={handleClick}
                role={isClickable ? 'button' : undefined}
                tabIndex={isClickable ? 0 : undefined}
                onKeyDown={isClickable ? e => e.key === 'Enter' && handleClick() : undefined}
              >
                {isCompleted ? (
                  <span className={css.checkmark}>✓</span>
                ) : (
                  <span className={css.stepNumber}>{stepNumber}</span>
                )}
              </div>
              {stepNumber < totalSteps && (
                <div
                  className={classNames(css.stepLine, {
                    [css.stepLineCompleted]: isCompleted,
                  })}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileStepIndicator;
