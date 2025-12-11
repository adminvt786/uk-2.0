import React, { useState, useEffect } from 'react';
import css from './HotelSuccessStories.module.css';

const HotelSuccessStories = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [swiperModules, setSwiperModules] = useState(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && isMounted) {
      Promise.all([import('swiper/react'), import('swiper/modules')])
        .then(([swiperReact, swiperModulesImport]) => {
          if (
            swiperReact?.Swiper &&
            swiperReact?.SwiperSlide &&
            swiperModulesImport?.Navigation &&
            swiperModulesImport?.Pagination
          ) {
            setSwiperModules({
              Swiper: swiperReact.Swiper,
              SwiperSlide: swiperReact.SwiperSlide,
              Navigation: swiperModulesImport.Navigation,
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
  const NavigationModule = swiperModules?.Navigation;
  const PaginationModule = swiperModules?.Pagination;

  // Each hotel story contains: header, 4 images, 3 metrics
  const hotelStories = [
    {
      id: 1,
      iconText: 'SW',
      hotelName: 'Serenity Wellness Retreat',
      images: [
        {
          id: 1,
          url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
          alt: 'Luxury yacht',
        },
        {
          id: 2,
          url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop',
          alt: 'Modern bathroom',
        },
        {
          id: 3,
          url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
          alt: 'Beverage and magazine',
        },
        {
          id: 4,
          url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
          alt: 'Relaxing woman',
        },
      ],
      metrics: [
        {
          id: 1,
          value: '+85K organic reach',
          label: 'Organic Reach',
        },
        {
          id: 2,
          value: '32 assets delivered',
          label: 'Content Assets',
        },
        {
          id: 3,
          value: '2,100 link clicks to booking page',
          label: 'Booking Clicks',
        },
      ],
    },
    {
      id: 2,
      iconText: 'GR',
      hotelName: 'Grand Resort',
      images: [
        {
          id: 1,
          url: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop',
          alt: 'Resort pool',
        },
        {
          id: 2,
          url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop',
          alt: 'Hotel room',
        },
        {
          id: 3,
          url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
          alt: 'Lounge area',
        },
        {
          id: 4,
          url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
          alt: 'Ocean view',
        },
      ],
      metrics: [
        {
          id: 1,
          value: '+120K organic reach',
          label: 'Organic Reach',
        },
        {
          id: 2,
          value: '45 assets delivered',
          label: 'Content Assets',
        },
        {
          id: 3,
          value: '3,500 link clicks to booking page',
          label: 'Booking Clicks',
        },
      ],
    },
  ];

  const ArrowLeftIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M15 18L9 12L15 6"
        stroke="#4B5563"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const ArrowRightIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9 18L15 12L9 6"
        stroke="#4B5563"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <section className={css.root}>
      <div className={css.header}>
        <h2 className={css.title}>Hotel Success Stories</h2>
        <p className={css.subtitle}>
          See how properties like yours are elevating their content and bookings.
        </p>
      </div>

      {Swiper && SwiperSlide && NavigationModule && PaginationModule && (
        <div className={css.mainCard}>
          <Swiper
            modules={[NavigationModule, PaginationModule]}
            spaceBetween={0}
            slidesPerView={1}
            loop={false}
            watchOverflow={true}
            navigation={{
              prevEl: `.${css.navButtonPrev}`,
              nextEl: `.${css.navButtonNext}`,
            }}
            pagination={{
              clickable: true,
              el: `.${css.pagination}`,
              bulletClass: css.paginationBullet,
              bulletActiveClass: css.paginationBulletActive,
            }}
            className={css.swiper}
          >
            {hotelStories.map((story) => (
              <SwiperSlide key={story.id} className={css.swiperSlide}>
                <div className={css.slideContent}>
                  {/* Header */}
                  <div className={css.cardHeader}>
                    <div className={css.iconWrapper}>
                      <span className={css.iconText}>{story.iconText}</span>
                    </div>
                    <h3 className={css.hotelName}>{story.hotelName}</h3>
                  </div>

                  {/* 4 Image Cards */}
                  <div className={css.imagesGrid}>
                    {story.images.map((image) => (
                      <div key={image.id} className={css.imageCard}>
                        <div className={css.cardImageWrapper}>
                          <img src={image.url} alt={image.alt} className={css.cardImage} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 3 Metric Cards */}
                  <div className={css.metricsGrid}>
                    {story.metrics.map((metric) => (
                      <div key={metric.id} className={css.metricCard}>
                        <div className={css.metricValue}>{metric.value}</div>
                        <div className={css.metricLabel}>{metric.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation */}
          <div className={css.navigation}>
            <button className={`${css.navButton} ${css.navButtonPrev}`} aria-label="Previous">
              <ArrowLeftIcon />
            </button>
            <button className={`${css.navButton} ${css.navButtonNext}`} aria-label="Next">
              <ArrowRightIcon />
            </button>
          </div>
          <div className={css.pagination}></div>
        </div>
      )}
    </section>
  );
};

export default HotelSuccessStories;
