import React, { useState, useEffect } from 'react';
import Field, { hasDataInFields } from '../../containers/PageBuilder/Field';
import SectionContainer from '../../containers/PageBuilder/SectionBuilder/SectionContainer';
import css from './FeaturedTravelCreator.module.css';
import {
  customInProgressSelector,
  featuredListingsSelector,
} from '../../containers/CMSPage/CMSPage.duck';
import { useSelector } from 'react-redux';
import ListingCard from '../ListingCard/ListingCard';
import IconSpinner from '../IconSpinner/IconSpinner';

const FeaturedTravelCreator = props => {
  const listings = useSelector(featuredListingsSelector);
  const inProgress = useSelector(customInProgressSelector);
  const {
    title,
    description,
    blocks = [],
    defaultClasses,
    callToAction,
    appearance,
    options,
    sectionId,
  } = props;

  const fieldComponents = options?.fieldComponents;
  const fieldOptions = { fieldComponents };
  const hasHeaderFields = hasDataInFields([title, description], fieldOptions);

  const [isMounted, setIsMounted] = useState(false);
  const [swiperModules, setSwiperModules] = useState(null);

  useEffect(() => {
    // Mark component as mounted
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Dynamically import Swiper only on client side and after mount
    if (typeof window !== 'undefined' && isMounted) {
      Promise.all([import('swiper/react'), import('swiper/modules')])
        .then(([swiperReact, swiperModulesImport]) => {
          if (swiperReact?.Swiper && swiperReact?.SwiperSlide && swiperModulesImport?.Pagination) {
            // Store everything together to ensure consistency
            setSwiperModules({
              Swiper: swiperReact.Swiper,
              SwiperSlide: swiperReact.SwiperSlide,
              Pagination: swiperModulesImport.Pagination,
            });
          }
        })
        .catch(error => {
          console.error('Failed to load Swiper:', error);
        });
    }
  }, [isMounted]);

  const Swiper = swiperModules?.Swiper;
  const SwiperSlide = swiperModules?.SwiperSlide;
  const PaginationModule = swiperModules?.Pagination;

  return (
    <SectionContainer
      id={sectionId}
      appearance={appearance}
      options={fieldOptions}
      className={css.root}
    >
      {hasHeaderFields && (
        <header className={css.header}>
          <Field data={title} className={css.title} options={fieldOptions} />
          <Field data={description} className={css.description} options={fieldOptions} />
        </header>
      )}

      {inProgress && (
        <div className={css.loadingContainer}>
          <IconSpinner />
        </div>
      )}

      {blocks.length > 0 && (
        <>
          {/* Desktop Grid */}
          <div className={css.desktopGrid}>
            {listings.map((l, index) => {
              return (
                <div key={l.id.uuid} className={css.card}>
                  <ListingCard
                    className={css.listingCard}
                    listing={l}
                    renderSizes={[
                      '(max-width: 549px) 100vw',
                      '(max-width: 767px) 50vw',
                      `(max-width: 1439px) 26vw`,
                      `(max-width: 1920px) 18vw`,
                      `14vw`,
                    ].join(', ')}
                    hidePrice
                  />
                  {/* <div className={css.cardImageWrapper}>
                    <Field data={block.media} className={css.cardImage} options={fieldOptions} />
                  </div>
                  <div className={css.cardContent}>
                    <Field data={block.title} className={css.cardTitle} options={fieldOptions} />
                    <Field
                      data={block.text}
                      className={css.cardDescription}
                      options={fieldOptions}
                    />
                    <Field
                      data={block.callToAction}
                      className={css.ctaButton}
                      options={fieldOptions}
                    />
                  </div> */}
                </div>
              );
            })}
          </div>

          {/* Mobile Carousel */}
          {Swiper && SwiperSlide && PaginationModule && (
            <div className={css.mobileCarousel}>
              <Swiper
                modules={[PaginationModule]}
                spaceBetween={16}
                slidesPerView={1.3}
                centeredSlides={true}
                pagination={false}
                className={css.swiper}
              >
                {listings.map(l => {
                  return (
                    <SwiperSlide key={l.id.uuid} className={css.swiperSlide}>
                      <div className={css.card}>
                        <ListingCard
                          className={css.listingCard}
                          listing={l}
                          renderSizes={[
                            '(max-width: 549px) 100vw',
                            '(max-width: 767px) 50vw',
                            `(max-width: 1439px) 26vw`,
                            `(max-width: 1920px) 18vw`,
                            `14vw`,
                          ].join(', ')}
                          hidePrice
                        />
                        {/* <div className={css.cardImageWrapper}>
                          <Field
                            data={block.media}
                            className={css.cardImage}
                            options={fieldOptions}
                          />
                        </div>
                        <div className={css.cardContent}>
                          <Field
                            data={block.title}
                            className={css.cardTitle}
                            options={fieldOptions}
                          />
                          <Field
                            data={block.text}
                            className={css.cardDescription}
                            options={fieldOptions}
                          />
                          <Field
                            data={block.callToAction}
                            className={css.ctaButton}
                            options={fieldOptions}
                          />
                        </div> */}
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          )}
          <Field data={callToAction} className={css.ctaButtonFooter} options={fieldOptions} />
        </>
      )}
    </SectionContainer>
  );
};

export default FeaturedTravelCreator;
