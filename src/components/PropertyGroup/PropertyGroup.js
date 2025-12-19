/*
 * Renders a set of options with selected and non-selected values.
 *
 * The corresponding component when selecting the values is
 * FieldCheckboxGroup.
 *
 */

import React from 'react';
import classNames from 'classnames';
import includes from 'lodash/includes';

import css from './PropertyGroup.module.css';

const checkSelected = (options, selectedOptions) => {
  return options.map(option => ({
    key: option.key,
    label: option.label,
    isSelected: includes(selectedOptions, option.key),
  }));
};

const IconCheck = props => {
  const isVisible = props.isVisible;
  const classes = isVisible ? css.checkIcon : classNames(css.checkIcon, css.hidden);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={classes}
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5"></path>
    </svg>
  );
};

const Item = props => {
  const { label, isSelected } = props;
  const labelClass = isSelected ? css.selectedLabel : css.notSelectedLabel;
  return (
    <li className={css.item} aria-hidden={!isSelected}>
      <span className={css.iconWrapper}>
        <IconCheck isVisible={isSelected} />
      </span>
      <div className={css.labelWrapper}>
        {isSelected ? (
          <span className={labelClass}>{label}</span>
        ) : (
          <s>
            <span className={labelClass}>{label}</span>
          </s>
        )}
      </div>
    </li>
  );
};

/**
 * @typedef {Object} Option
 * @property {string} key - The key of the option
 * @property {string} label - The label of the option
 */
/**
 * A component that renders a set of options with selected and non-selected values.
 *
 * @component
 * @param {Object} props
 * @param {string} [props.rootClassName] - Custom class that overrides the default class for the root element
 * @param {string} [props.className] - Custom class that extends the default class for the root element
 * @param {string} props.id - The id of the property group
 * @param {Array<Option>} props.options - The options to render
 * @param {Array<string>} props.selectedOptions - The selected options
 * @param {boolean} props.twoColumns - Whether to render the options in two columns
 * @param {boolean} props.showUnselectedOptions - Whether to show the unselected options
 * @returns {JSX.Element}
 */
const PropertyGroup = props => {
  const {
    rootClassName,
    className,
    id,
    ariaLabel,
    options,
    selectedOptions = [],
    twoColumns,
    showUnselectedOptions,
  } = props;
  const classes = classNames(rootClassName || css.root, className);
  const listClasses = twoColumns ? classNames(classes, css.twoColumns) : classes;
  const ariaLabelMaybe = ariaLabel ? { ['aria-label']: ariaLabel } : {};

  const checked = showUnselectedOptions
    ? checkSelected(options, selectedOptions).sort((a, b) => {
        // Show selected options first, unselected options last
        if (a.isSelected && !b.isSelected) return -1;
        if (!a.isSelected && b.isSelected) return 1;
        return 0; // Maintain original order for items with same selection status
      })
    : checkSelected(options, selectedOptions).filter(o => o.isSelected);
  return (
    <ul className={listClasses} {...ariaLabelMaybe}>
      {checked.map(option => (
        <Item key={`${id}.${option.key}`} label={option.label} isSelected={option.isSelected} />
      ))}
    </ul>
  );
};

export default PropertyGroup;
