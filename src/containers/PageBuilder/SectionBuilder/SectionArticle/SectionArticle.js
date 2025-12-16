import React from 'react';
import classNames from 'classnames';

import Field, { hasDataInFields } from '../../Field';
import BlockBuilder from '../../BlockBuilder';

import SectionContainer from '../SectionContainer';
import css from './SectionArticle.module.css';
import FeaturedCreators from '../../../../components/FeaturedCreators/FeaturedCreators';
import SuccessStories from '../../../../components/SuccessStories/SuccessStories';
import SuccessStoriesTwo from '../../../../components/SuccessStoriesTwo/SuccessStoriesTwo';
import HotelSuccessStories from '../../../../components/HotelSuccessStories/HotelSuccessStories';
import FaqSection from '../../../../components/FaqSection/FaqSection';

/**
 * @typedef {Object} BlockConfig
 * @property {string} blockId
 * @property {string} blockName
 * @property {'defaultBlock' | 'footerBlock' | 'socialMediaLink'} blockType
 */

/**
 * @typedef {Object} FieldComponentConfig
 * @property {ReactNode} component
 * @property {Function} pickValidProps
 */

/**
 * Section component that's able to show article content.
 * The article content is mainly supposed to be inside a block.
 *
 * @component
 * @param {Object} props
 * @param {string?} props.className add more style rules in addition to components own css.root
 * @param {string?} props.rootClassName overwrite components own css.root
 * @param {Object} props.defaultClasses
 * @param {string} props.defaultClasses.sectionDetails
 * @param {string} props.defaultClasses.title
 * @param {string} props.defaultClasses.description
 * @param {string} props.defaultClasses.ctaButton
 * @param {string} props.sectionId id of the section
 * @param {'article'} props.sectionType
 * @param {Object?} props.title
 * @param {Object?} props.description
 * @param {Object?} props.appearance
 * @param {Object?} props.callToAction
 * @param {Array<BlockConfig>?} props.blocks array of block configs
 * @param {boolean?} props.isInsideContainer
 * @param {Object} props.options extra options for the section component (e.g. custom fieldComponents)
 * @param {Object<string,FieldComponentConfig>?} props.options.fieldComponents custom fields
 * @returns {JSX.Element} Section for article content
 */
const SectionArticle = props => {
  const {
    sectionId,
    className,
    rootClassName,
    defaultClasses,
    title,
    description,
    appearance,
    callToAction,
    blocks = [],
    isInsideContainer = false,
    options,
  } = props;

  // If external mapping has been included for fields
  // E.g. { h1: { component: MyAwesomeHeader } }
  const fieldComponents = options?.fieldComponents;
  const fieldOptions = { fieldComponents };

  const hasHeaderFields = hasDataInFields([title, description, callToAction], fieldOptions);
  const hasBlocks = blocks?.length > 0;

  if (sectionId === 'faq_section') {
    return (
      <FaqSection
        title={title}
        description={description}
        blocks={blocks}
        defaultClasses={defaultClasses}
        appearance={appearance}
        options={options}
        sectionId={sectionId}
        callToAction={callToAction}
      />
    );
  }
  if (sectionId === 'hotel_success_stories') {
    return (
      <HotelSuccessStories
        title={title}
        description={description}
        callToAction={callToAction}
        options={options}
        sectionId={sectionId}
        blocks={blocks}
      />
    );
  }
  if (sectionId === 'success_stories_two') {
    return (
      <SuccessStoriesTwo
        title={title}
        description={description}
        callToAction={callToAction}
        options={options}
        sectionId={sectionId}
        blocks={blocks}
      />
    );
  }
  if (sectionId === 'featured_creators_section') {
    return (
      <FeaturedCreators
        title={title}
        description={description}
        callToAction={callToAction}
        options={options}
        sectionId={sectionId}
        blocks={blocks}
      />
    );
  }
  if (sectionId === 'success_stories_section') {
    return (
      <SuccessStories
        title={title}
        description={description}
        callToAction={callToAction}
        options={options}
        sectionId={sectionId}
        blocks={blocks}
      />
    );
  }

  return (
    <SectionContainer
      id={sectionId}
      className={className}
      rootClassName={rootClassName}
      appearance={appearance}
      options={fieldOptions}
    >
      {hasHeaderFields ? (
        <header className={defaultClasses.sectionDetails}>
          <Field data={title} className={defaultClasses.title} options={fieldOptions} />
          <Field data={description} className={defaultClasses.description} options={fieldOptions} />
          <Field data={callToAction} className={defaultClasses.ctaButton} options={fieldOptions} />
        </header>
      ) : null}
      {hasBlocks ? (
        <div
          className={classNames(defaultClasses.blockContainer, css.articleMain, {
            [css.noSidePaddings]: isInsideContainer,
          })}
        >
          <BlockBuilder
            blocks={blocks}
            sectionId={sectionId}
            ctaButtonClass={defaultClasses.ctaButton}
            options={options}
          />
        </div>
      ) : null}
    </SectionContainer>
  );
};

export default SectionArticle;
