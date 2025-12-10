import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import Field, { hasDataInFields } from '../../Field';
import BlockBuilder from '../../BlockBuilder';

import SectionContainer from '../SectionContainer';
import css from './SectionCarousel.module.css';
import CreatorBenefitsSection from '../../../../components/CreatorBenefitsSection/CreatorBenefitsSection';
import WeAcceptApplicants from '../../../../components/WeAcceptApplicants/WeAcceptApplicants';
const KEY_CODE_ARROW_LEFT = 37;
const KEY_CODE_ARROW_RIGHT = 39;

// The number of columns (numColumns) affects styling and responsive images
const COLUMN_CONFIG = [
  { css: css.oneColumn, responsiveImageSizes: '(max-width: 767px) 100vw, 1200px' },
  { css: css.twoColumns, responsiveImageSizes: '(max-width: 767px) 100vw, 600px' },
  { css: css.threeColumns, responsiveImageSizes: '(max-width: 767px) 100vw, 400px' },
  { css: css.fourColumns, responsiveImageSizes: '(max-width: 767px) 100vw, 290px' },
];
const getIndex = numColumns => numColumns - 1;
const getColumnCSS = numColumns => {
  const config = COLUMN_CONFIG[getIndex(numColumns)];
  return config ? config.css : COLUMN_CONFIG[0].css;
};
const getResponsiveImageSizes = numColumns => {
  const config = COLUMN_CONFIG[getIndex(numColumns)];
  return config ? config.responsiveImageSizes : COLUMN_CONFIG[0].responsiveImageSizes;
};

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
 * Section component that's able to show blocks in a carousel.
 * The number blocks visible is defined by "numColumns" prop.
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
 * @param {'carousel'} props.sectionType
 * @param {number?} props.numColumns
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
const SectionCarousel = props => {
  const {
    sectionId,
    className,
    rootClassName,
    defaultClasses,
    numColumns = 1,
    title,
    description,
    appearance,
    callToAction,
    blocks = [],
    options,
  } = props;
  const sliderContainerId = `${props.sectionId}-container`;
  const sliderId = `${props.sectionId}-slider`;
  const numberOfBlocks = blocks?.length;
  const hasBlocks = numberOfBlocks > 0;
  const [currentSlide, setCurrentSlide] = useState(0);
  // On mobile, show one dot per block (numColumns is effectively 1)
  // On desktop, calculate based on actual numColumns
  const totalSlides = Math.ceil(numberOfBlocks / numColumns);
  const mobileTotalSlides = numberOfBlocks; // One dot per block on mobile

  
  if(sectionId === 'we_accept_applicants') {
    return (
      <WeAcceptApplicants
        title={title}
        description={description}
        blocks={blocks}
        defaultClasses={defaultClasses}
        appearance={appearance}
        options={options}
        sectionId={sectionId}
      />
    );
  }
  if(sectionId === 'creator_benefits_section') {
    return (
      <CreatorBenefitsSection
        title={title}
        description={description}
        blocks={blocks}
        defaultClasses={defaultClasses}
        appearance={appearance}
        options={options}
        sectionId={sectionId}
      />
    );
  }


  useEffect(() => {
    const setCarouselWidth = () => {
      if (hasBlocks) {
        const windowWidth = window.innerWidth;
        const elem = window.document.getElementById(sliderContainerId);
        const scrollbarWidth = window.innerWidth - document.body.clientWidth;
        const elementWidth =
          elem.clientWidth >= windowWidth - scrollbarWidth ? windowWidth : elem.clientWidth;
        const carouselWidth = elementWidth - scrollbarWidth;

        elem.style.setProperty('--carouselWidth', `${carouselWidth}px`);
      }
    };
    setCarouselWidth();

    window.addEventListener('resize', setCarouselWidth);
    return () => window.removeEventListener('resize', setCarouselWidth);
  }, []);

  

  // Track scroll position to update current slide
  useEffect(() => {
    if (!hasBlocks || mobileTotalSlides <= 1) return;

    const slider = window.document.getElementById(sliderId);
    if (!slider) return;

    const updateCurrentSlide = () => {
      const firstBlock = slider.firstChild;
      if (!firstBlock) return;

      const blockWidth = firstBlock.clientWidth;
      const gap = 16; // margin-right from CSS
      // On mobile, treat as 1 column for pagination (one dot per block)
      const isMobile = window.innerWidth <= 767;
      const effectiveColumns = isMobile ? 1 : numColumns;
      const slideWidth = blockWidth * effectiveColumns + gap * (effectiveColumns - 1);
      const scrollLeft = slider.scrollLeft;
      const slideIndex = Math.round(scrollLeft / slideWidth);
      const clampedIndex = Math.max(0, Math.min(slideIndex, mobileTotalSlides - 1));
      setCurrentSlide(clampedIndex);
    };

    slider.addEventListener('scroll', updateCurrentSlide, { passive: true });
    updateCurrentSlide(); // Set initial slide

    return () => {
      slider.removeEventListener('scroll', updateCurrentSlide);
    };
  }, [hasBlocks, numColumns, mobileTotalSlides, sliderId]);

  // If external mapping has been included for fields
  // E.g. { h1: { component: MyAwesomeHeader } }
  const fieldComponents = options?.fieldComponents;
  const fieldOptions = { fieldComponents };

  const hasHeaderFields = hasDataInFields([title, description, callToAction], fieldOptions);

  const onSlideLeft = e => {
    var slider = window.document.getElementById(sliderId);
    const slideWidth = numColumns * slider?.firstChild?.clientWidth;
    slider.scrollLeft = slider.scrollLeft - slideWidth;
    // Fix for Safari
    e.target.focus();
  };

  const onSlideRight = e => {
    var slider = window.document.getElementById(sliderId);
    const slideWidth = numColumns * slider?.firstChild?.clientWidth;
    slider.scrollLeft = slider.scrollLeft + slideWidth;
    // Fix for Safari
    e.target.focus();
  };

  const onDotClick = (index) => {
    const slider = window.document.getElementById(sliderId);
    if (!slider || !slider.firstChild) return;
    
    const blockWidth = slider.firstChild.clientWidth;
    const gap = 16; // margin-right from CSS
    // On mobile, treat as 1 column for pagination (one dot per block)
    const isMobile = window.innerWidth <= 767;
    const effectiveColumns = isMobile ? 1 : numColumns;
    const slideWidth = blockWidth * effectiveColumns + gap * (effectiveColumns - 1);
    const scrollPosition = index * slideWidth;
    
    slider.scrollTo({ left: scrollPosition, behavior: 'smooth' });
  };

  const onKeyDown = e => {
    if (e.keyCode === KEY_CODE_ARROW_LEFT) {
      // Prevent changing cursor position in input
      e.preventDefault();
      onSlideLeft(e);
    } else if (e.keyCode === KEY_CODE_ARROW_RIGHT) {
      // Prevent changing cursor position in input
      e.preventDefault();
      onSlideRight(e);
    }
  };

  const isLongDot = (sectionId === 'paid_columns_section' || sectionId === 'pre_columns_section');

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
        <div className={css.carouselContainer} id={sliderContainerId}>
          <div
            className={classNames(css.carouselArrows, {
              [css.notEnoughBlocks]: numberOfBlocks <= numColumns,
            })}
          >
            <button className={css.carouselArrowPrev} onClick={onSlideLeft} onKeyDown={onKeyDown}>
              ‹
            </button>
            <button className={css.carouselArrowNext} onClick={onSlideRight} onKeyDown={onKeyDown}>
              ›
            </button>
          </div>
          <div className={getColumnCSS(numColumns)} id={sliderId}>
            <BlockBuilder
              rootClassName={css.block}
              ctaButtonClass={defaultClasses.ctaButton}
              blocks={blocks}
              sectionId={sectionId}
              responsiveImageSizes={getResponsiveImageSizes(numColumns)}
              options={options}
            />
          </div>
          {numberOfBlocks > 1 && (
            <div className={classNames(css.paginationDots, isLongDot ? css.paidColumnsPaginationDots : '')}>
              {Array.from({ length: mobileTotalSlides }).map((_, index) => (
                <button
                  key={index}
                  className={classNames(css.paginationDot, {
                    [css.paginationDotActive]: currentSlide === index,
                  })}
                  onClick={() => onDotClick(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      ) : null}
    </SectionContainer>
  );
};

export default SectionCarousel;
