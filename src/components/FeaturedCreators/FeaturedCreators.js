import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import css from './FeaturedCreators.module.css';
import creator1 from '../../assets/FeaturedCreateor/FeaturedCreateor1.png';
import creator2 from '../../assets/FeaturedCreateor/FeaturedCreateor2.png';
import creator3 from '../../assets/FeaturedCreateor/FeaturedCreateor3.png';
import creator4 from '../../assets/FeaturedCreateor/FeaturedCreateor4.png';

const FeaturedCreators = () => {
    const creators = [
        {
            id: 1,
            name: 'Sofia Chen',
            location: 'Singapore',
            followers: '850K',
            tag: 'LUXURY RESORTS',
            image: creator1
        },
        {
            id: 2,
            name: 'Marcus Rodriguez',
            location: 'Barcelona',
            followers: '1.2M',
            tag: 'BOUTIQUE HOTELS',
            image: creator2
        },
        {
            id: 3,
            name: 'Amara Williams',
            location: 'Dubai',
            followers: '920K',
            tag: 'DESERT LUXURY',
            image: creator3
        },
        {
            id: 4,
            name: 'Luca Rossi',
            location: 'Como, Italy',
            followers: '780K',
            tag: 'VILLA EXPERIENCES',
            image: creator4
        }
    ];

    return (
        <section className={css.featuredCreators}>
            <header className={css.header}>
                <h2 className={css.sectionLabel}>OUR ELITE NETWORK</h2>
                <h1 className={css.title}>Featured Creators</h1>
                <p className={css.description}>
                    Handpicked professionals trusted by the world's finest hotels and resorts
                </p>
            </header>
            
            <div className={css.swiperWrapper}>
                <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={20}
                    slidesPerView={1.3}
                    navigation={true}
                    pagination={false}
                    breakpoints={{
                        640: {
                            slidesPerView: 2,
                            spaceBetween: 20,
                        },
                        1024: {
                            slidesPerView: 4,
                            spaceBetween: 20,
                        },
                    }}
                    className={css.swiper}
                >
                    {creators.map(creator => (
                        <SwiperSlide key={creator.id} className={css.swiperSlide}>
                            <div className={css.creatorCard}>
                                <div className={css.imageWrapper}>
                                    <img src={creator.image} alt={creator.name} className={css.creatorImage} />
                                </div>
                                <div className={css.creatorInfo}>
                                    <h3 className={css.creatorName}>{creator.name}</h3>
                                    <div className={css.metaInfo}>
                                        <div className={css.metaItem}>
                                            <svg width="13" height="18" viewBox="0 0 13 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M6.15409 0.615479C3.09625 0.615479 0.615356 2.97675 0.615356 5.88497C0.615356 9.23129 4.30785 14.5342 5.66368 16.3659C5.71996 16.4432 5.79373 16.5061 5.87896 16.5495C5.96418 16.5929 6.05846 16.6155 6.15409 16.6155C6.24973 16.6155 6.344 16.5929 6.42923 16.5495C6.51446 16.5061 6.58822 16.4432 6.6445 16.3659C8.00034 14.535 11.6928 9.23398 11.6928 5.88497C11.6928 2.97675 9.21194 0.615479 6.15409 0.615479Z" stroke="#666" strokeWidth="1.23083" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M6.15409 8.00046C7.17375 8.00046 8.00034 7.17387 8.00034 6.15421C8.00034 5.13456 7.17375 4.30797 6.15409 4.30797C5.13444 4.30797 4.30785 5.13456 4.30785 6.15421C4.30785 7.17387 5.13444 8.00046 6.15409 8.00046Z" stroke="#666" strokeWidth="1.23083" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            <span>{creator.location}</span>
                                        </div>
                                        <div className={css.metaItem}>
                                            <svg width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M2.62464 4.12826C2.62479 3.41649 2.80893 2.71684 3.15919 2.09721C3.50945 1.47758 4.01393 0.959011 4.62369 0.59183C5.23345 0.22465 5.92776 0.0213254 6.63927 0.00158812C7.35077 -0.0181491 8.05529 0.146371 8.68446 0.479183C9.31364 0.811996 9.8461 1.3018 10.2302 1.90106C10.6142 2.50032 10.8369 3.18868 10.8765 3.89936C10.9161 4.61003 10.7713 5.31887 10.4562 5.9571C10.1411 6.59533 9.66638 7.14126 9.07809 7.54193C10.345 8.00659 11.4438 8.83976 12.2332 9.9342C13.0226 11.0286 13.4664 12.3343 13.5075 13.6831C13.5058 13.8285 13.4479 13.9676 13.346 14.0714C13.2441 14.1751 13.106 14.2355 12.9606 14.2398C12.8153 14.2442 12.6738 14.1922 12.5659 14.0948C12.458 13.9973 12.3918 13.8619 12.3814 13.7168C12.3367 12.254 11.7241 10.866 10.6736 9.84704C9.62299 8.82808 8.21694 8.25822 6.75339 8.25822C5.28984 8.25822 3.88379 8.82808 2.83322 9.84704C1.78264 10.866 1.1701 12.254 1.12539 13.7168C1.11787 13.8639 1.05308 14.0021 0.94488 14.1019C0.836683 14.2018 0.693693 14.2552 0.546542 14.2509C0.399392 14.2466 0.259785 14.1848 0.15763 14.0788C0.0554745 13.9728 -0.00110353 13.831 1.63121e-05 13.6838C0.0409707 12.3349 0.484706 11.0291 1.2741 9.93451C2.0635 8.83992 3.16243 8.00664 4.42944 7.54193C3.87319 7.16309 3.41798 6.65403 3.10342 6.05906C2.78886 5.4641 2.6245 4.80127 2.62464 4.12826ZM6.75376 1.12526C5.95732 1.12526 5.19349 1.44165 4.63032 2.00482C4.06715 2.56799 3.75076 3.33182 3.75076 4.12826C3.75076 4.92471 4.06715 5.68854 4.63032 6.25171C5.19349 6.81488 5.95732 7.13127 6.75376 7.13127C7.55021 7.13127 8.31403 6.81488 8.87721 6.25171C9.44038 5.68854 9.75676 4.92471 9.75676 4.12826C9.75676 3.33182 9.44038 2.56799 8.87721 2.00482C8.31403 1.44165 7.55021 1.12526 6.75376 1.12526ZM12.9775 4.12826C12.8669 4.12826 12.7583 4.13577 12.6517 4.15079C12.5772 4.16411 12.5009 4.16231 12.4272 4.14549C12.3534 4.12867 12.2839 4.09717 12.2226 4.05288C12.1613 4.00859 12.1096 3.9524 12.0705 3.88768C12.0314 3.82296 12.0057 3.75102 11.995 3.67617C11.9843 3.60131 11.9888 3.52507 12.0082 3.45199C12.0276 3.37891 12.0616 3.31049 12.108 3.25081C12.1544 3.19113 12.2124 3.14141 12.2785 3.10462C12.3445 3.06783 12.4173 3.04472 12.4925 3.03667C13.2392 2.92872 14.0006 3.07211 14.6568 3.44427C15.3131 3.81644 15.8269 4.39626 16.1176 5.09247C16.4082 5.78869 16.4591 6.56178 16.2622 7.29008C16.0653 8.01838 15.6319 8.66054 15.03 9.1155C15.9147 9.51163 16.6659 10.1553 17.1928 10.9688C17.7198 11.7824 18.0002 12.731 18 13.7003C18 13.8497 17.9407 13.9929 17.8351 14.0985C17.7295 14.2041 17.5863 14.2634 17.4369 14.2634C17.2876 14.2634 17.1444 14.2041 17.0388 14.0985C16.9332 13.9929 16.8739 13.8497 16.8739 13.7003C16.8741 12.8625 16.6044 12.0469 16.1045 11.3745C15.6047 10.7021 14.9015 10.2088 14.0991 9.9676L13.6982 9.84748V8.58922L14.006 8.43232C14.4623 8.20119 14.8274 7.82305 15.0423 7.35892C15.2572 6.8948 15.3094 6.37179 15.1906 5.87433C15.0717 5.37686 14.7886 4.93398 14.3871 4.61717C13.9855 4.30037 13.489 4.12813 12.9775 4.12826Z" fill="#666"/>
                                            </svg>
                                            <span>{creator.followers}</span>
                                        </div>
                                    </div>
                                    <div className={css.tag}>{creator.tag}</div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <div className={css.footerLink}>
                <a href="#" className={css.viewAllLink}>
                    View All Elite Creators
                    <svg width="15" height="12" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.625 5.625L13.9583 5.625M13.9583 5.625L8.95833 10.625M13.9583 5.625L8.95833 0.625" stroke="#D9A441" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </a>
            </div>
        </section>
    );
};

export default FeaturedCreators;
