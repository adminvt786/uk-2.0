import React, { useState, useEffect } from 'react';
import Field, { hasDataInFields } from '../../containers/PageBuilder/Field';
import SectionContainer from '../../containers/PageBuilder/SectionBuilder/SectionContainer';
import css from './CreatorBenefitsSection.module.css';

// Icon components - inline SVGs matching the design
const IconHotel = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 21V5C3 4.44772 3.44772 4 4 4H20C20.5523 4 21 4.44772 21 5V21" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 9H21" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
    <path d="M7 13H7.01" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
    <path d="M11 13H11.01" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
    <path d="M15 13H15.01" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
    <path d="M19 13H19.01" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const IconDollar = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="#FFD700" strokeWidth="2"/>
    <path d="M12 6V18" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
    <path d="M9 9C9 8.17157 9.67157 7.5 10.5 7.5H13.5C14.3284 7.5 15 8.17157 15 9C15 9.82843 14.3284 10.5 13.5 10.5H10.5C9.67157 10.5 9 11.1716 9 12C9 12.8284 9.67157 13.5 10.5 13.5H13.5C14.3284 13.5 15 14.1716 15 15C15 15.8284 14.3284 16.5 13.5 16.5H10.5C9.67157 16.5 9 15.8284 9 15" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const IconVideo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="6" width="16" height="12" rx="2" stroke="#FFD700" strokeWidth="2"/>
    <path d="M18 10L22 7V17L18 14" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconShare = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="18" cy="5" r="3" stroke="#FFD700" strokeWidth="2"/>
    <circle cx="6" cy="12" r="3" stroke="#FFD700" strokeWidth="2"/>
    <circle cx="18" cy="19" r="3" stroke="#FFD700" strokeWidth="2"/>
    <path d="M8.59 13.51L15.42 17.49" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
    <path d="M15.41 6.51L8.59 10.49" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const IconDashboard = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="7" height="7" rx="1" stroke="#FFD700" strokeWidth="2"/>
    <rect x="14" y="3" width="7" height="7" rx="1" stroke="#FFD700" strokeWidth="2"/>
    <rect x="3" y="14" width="7" height="7" rx="1" stroke="#FFD700" strokeWidth="2"/>
    <rect x="14" y="14" width="7" height="7" rx="1" stroke="#FFD700" strokeWidth="2"/>
  </svg>
);

const IconStar = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconShield = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L4 5V11C4 16.55 7.16 21.74 12 23C16.84 21.74 20 16.55 20 11V5L12 2Z" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconAirplane = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 16V14L13 9V7C13 6.44772 12.5523 6 12 6C11.4477 6 11 6.44772 11 7V9L3 14V16L11 13.5V19L9 20.5V22L12 21L15 22V20.5L13 19V13.5L21 16Z" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Map icon names to icon components
const iconMap = {
  hotel: IconHotel,
  dollar: IconDollar,
  video: IconVideo,
  share: IconShare,
  dashboard: IconDashboard,
  star: IconStar,
  shield: IconShield,
  airplane: IconAirplane,
};

// Default icon mapping based on common block names/titles
const getIconForBlock = (block, index) => {
  const blockTitle = block?.title?.content?.toLowerCase() || '';
  const blockName = block?.blockName?.toLowerCase() || '';
  const combined = `${blockTitle} ${blockName}`;
  
  if (combined.includes('hotel') || combined.includes('resort')) return IconHotel;
  if (combined.includes('paid') || combined.includes('ugc') || combined.includes('monetize')) return IconDollar;
  if (combined.includes('video') || combined.includes('cinematic')) return IconVideo;
  if (combined.includes('native') || combined.includes('posting') || combined.includes('share')) return IconShare;
  if (combined.includes('dashboard') || combined.includes('pipeline')) return IconDashboard;
  if (combined.includes('priority') || combined.includes('status')) return IconStar;
  if (combined.includes('contract') || combined.includes('insurance') || combined.includes('protection')) return IconShield;
  if (combined.includes('press') || combined.includes('trip') || combined.includes('exclusive')) return IconAirplane;
  
  // Fallback to index-based mapping
  const icons = [IconHotel, IconDollar, IconVideo, IconShare, IconDashboard, IconStar, IconShield, IconAirplane];
  return icons[index % icons.length];
};

const CreatorBenefitsSection = props => {
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
      {hasHeaderFields && (
        <header className={css.header}>
          <Field data={title} className={css.title} options={fieldOptions} />
          <Field data={description} className={css.description} options={fieldOptions} />
        </header>
      )}

      {blocks.length > 0 && (
        <>
          {/* Desktop Grid */}
          <div className={css.desktopGrid}>
            {blocks.map((block, index) => {
              const IconComponent = getIconForBlock(block, index);
              return (
                <div key={block.blockId || `benefit-${index}`} className={css.card}>
                  <div className={css.cardImageWrapper}>
                    <Field
                      data={block.media}
                      className={css.cardImage}
                      options={fieldOptions}
                    />
                    <div className={css.iconOverlay}>
                      <IconComponent />
                    </div>
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
                slidesPerView={1}
                pagination={{
                  clickable: true,
                }}
                className={css.swiper}
              >
                {blocks.map((block, index) => {
                  const IconComponent = getIconForBlock(block, index);
                  return (
                    <SwiperSlide key={block.blockId || `benefit-${index}`} className={css.swiperSlide}>
                      <div className={css.card}>
                        <div className={css.cardImageWrapper}>
                          <Field
                            data={block.media}
                            className={css.cardImage}
                            options={fieldOptions}
                          />
                          <div className={css.iconOverlay}>
                            <IconComponent />
                          </div>
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
    </SectionContainer>
  );
};

export default CreatorBenefitsSection;
