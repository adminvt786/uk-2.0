import React, { useState, useEffect } from 'react';
import Field, { hasDataInFields } from '../../containers/PageBuilder/Field';
import SectionContainer from '../../containers/PageBuilder/SectionBuilder/SectionContainer';
import css from './WeAcceptApplicants.module.css';

const WeAcceptApplicants = props => {
  const {
    title,
    description,
    blocks = [],
    defaultClasses,
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
      <div className={css.container}>
        {hasHeaderFields && (
          <header className={css.header}>
            <div className={css.exclusiveTag}>EXCLUSIVE NETWORK</div>
            <Field data={title} className={css.title} options={fieldOptions} />
            <Field data={description} className={css.description} options={fieldOptions} />
          </header>
        )}

        {blocks.length > 0 && (
          <>
            {/* Desktop Grid */}
            <div className={css.desktopGrid}>
              {blocks.map((block, index) => {
                return (
                  <div key={block.blockId || `benefit-${index}`} className={css.card}>
                    <div className={css.iconWrapper}>
                      <Field
                        data={block.media}
                        className={css.iconImage}
                        options={fieldOptions}
                      />
                    </div>
                    <div className={css.cardContent}>
                      <Field data={block.title} className={css.cardTitle} options={fieldOptions} />
                      <Field data={block.text} className={css.cardDescription} options={fieldOptions} />
                    </div>
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
                  slidesPerView={1.1}
                  centeredSlides={true}
                  pagination={{
                    clickable: true,
                  }}
                  className={css.swiper}
                >
                  {blocks.map((block, index) => {
                    return (
                      <SwiperSlide key={block.blockId || `benefit-${index}`} className={css.swiperSlide}>
                        <div className={css.card}>
                          <div className={css.iconWrapper}>
                            <Field
                              data={block.media}
                              className={css.iconImage}
                              options={fieldOptions}
                            />
                          </div>
                          <div className={css.cardContent}>
                            <Field data={block.title} className={css.cardTitle} options={fieldOptions} />
                            <Field data={block.text} className={css.cardDescription} options={fieldOptions} />
                          </div>
                        </div>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>
            )}
          </>
        )}

      </div>
    </SectionContainer>
  );
};

export default WeAcceptApplicants;
