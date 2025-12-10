import React, { useState, useEffect } from 'react';
import css from './SuccessStoriesTwo.module.css';

const SuccessStoriesTwo = () => {
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

    const successStories = [
        {
            id: 1,
            testimonial: '"Ukreate helped me secure 3 luxury resort stays in 30 days. The quality of partnerships is unmatched."',
            name: "Sarah Chen",
            role: "Travel Creator",
            location: "Bali, Indonesia",
            followers: "185K",
            backgroundImage: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&h=800&fit=crop"
        },
        {
            id: 2,
            testimonial: '"The platform connected me with incredible hotel partners worldwide. My content has never been better."',   
            name: "Marcus Rodriguez",
            role: "Luxury Travel Blogger",
            location: "Barcelona, Spain",
            followers: "320K",
            backgroundImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop"
        },
        {
            id: 3,
            testimonial: '"Ukreate transformed my travel content career. Premium partnerships and seamless collaboration."',
            name: "Amara Williams",
            role: "Adventure Creator",
            location: "Dubai, UAE",
            followers: "450K",
            backgroundImage: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&h=800&fit=crop"
        }
    ];

    return (
        <section className={css.successStoriesSection}>
            <div className={css.container}>
                <header className={css.header}>
                    <h2 className={css.title}>Success Stories</h2>
                    <p className={css.subtitle}>Hear from elite creators thriving on Ukreate</p>
                </header>

                {Swiper && SwiperSlide && PaginationModule && (
                    <div className={css.swiperWrapper}>
                        <Swiper
                            modules={[PaginationModule]}
                            spaceBetween={20}
                            slidesPerView={1}
                            pagination={{
                                clickable: true,
                            }}
                            className={css.swiper}
                            breakpoints={{
                                0: {
                                    spaceBetween: 20,
                                    slidesPerView: 1,
                                },
                                768: {
                                    spaceBetween: 20,
                                    slidesPerView: 1,
                                },
                            }}
                        >
                            {successStories.map((story) => (
                                <SwiperSlide key={story.id} className={css.swiperSlide}>
                                    <div className={css.testimonialCard}>
                                        <div 
                                            className={css.cardBackground}
                                            style={{ backgroundImage: `url(${story.backgroundImage})` }}
                                        >
                                            <div className={css.cardOverlay}></div>
                                        </div>
                                        <div className={css.cardContent}>
                                            <div className={css.quoteIcon}>
                                            <svg width="35" height="26" viewBox="0 0 35 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<path opacity="0.7" d="M13.2954 12.5454H3.92041C3.42313 12.5454 2.94622 12.3443 2.59459 11.9862C2.24295 11.6282 2.04541 11.1426 2.04541 10.6363V3.9545C2.04541 3.44818 2.24295 2.96259 2.59459 2.60457C2.94622 2.24655 3.42313 2.04541 3.92041 2.04541H11.4204C11.9177 2.04541 12.3946 2.24655 12.7462 2.60457C13.0979 2.96259 13.2954 3.44818 13.2954 3.9545V12.5454ZM13.2954 12.5454C13.2954 17.3181 11.4204 20.1818 5.79541 23.0454M32.0454 12.5454H22.6704C22.1731 12.5454 21.6962 12.3443 21.3446 11.9862C20.993 11.6282 20.7954 11.1426 20.7954 10.6363V3.9545C20.7954 3.44818 20.993 2.96259 21.3446 2.60457C21.6962 2.24655 22.1731 2.04541 22.6704 2.04541H30.1704C30.6677 2.04541 31.1446 2.24655 31.4962 2.60457C31.8479 2.96259 32.0454 3.44818 32.0454 3.9545V12.5454ZM32.0454 12.5454C32.0454 17.3181 30.1704 20.1818 24.5454 23.0454" stroke="#D9A441" strokeWidth="4.09091" strokeLinecap="round"/>
</svg>

                                            </div>
                                            <div className={css.stars}>
                                            <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.79255 0L11.4118 5.63991L17.585 6.38809L13.0305 10.6219L14.2266 16.7243L8.79255 13.701L3.35851 16.7243L4.55458 10.6219L8.67844e-05 6.38809L6.17334 5.63991L8.79255 0Z" fill="#D9A441"/>
</svg>
                                            <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.79255 0L11.4118 5.63991L17.585 6.38809L13.0305 10.6219L14.2266 16.7243L8.79255 13.701L3.35851 16.7243L4.55458 10.6219L8.67844e-05 6.38809L6.17334 5.63991L8.79255 0Z" fill="#D9A441"/>
</svg>
                                            <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.79255 0L11.4118 5.63991L17.585 6.38809L13.0305 10.6219L14.2266 16.7243L8.79255 13.701L3.35851 16.7243L4.55458 10.6219L8.67844e-05 6.38809L6.17334 5.63991L8.79255 0Z" fill="#D9A441"/>
</svg>
                                            <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.79255 0L11.4118 5.63991L17.585 6.38809L13.0305 10.6219L14.2266 16.7243L8.79255 13.701L3.35851 16.7243L4.55458 10.6219L8.67844e-05 6.38809L6.17334 5.63991L8.79255 0Z" fill="#D9A441"/>
</svg>
                                            <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.79255 0L11.4118 5.63991L17.585 6.38809L13.0305 10.6219L14.2266 16.7243L8.79255 13.701L3.35851 16.7243L4.55458 10.6219L8.67844e-05 6.38809L6.17334 5.63991L8.79255 0Z" fill="#D9A441"/>
</svg>

                                            </div>
                                            <p className={css.testimonialText}>{story.testimonial}</p>
                                            <div className={css.creatorInfo}>
                                                <div className={css.creatorDetails}>
                                                    <div className={css.creatorName}>{story.name}</div>
                                                    <div className={css.creatorRole}>{story.role}</div>
                                                    <div className={css.creatorLocation}>{story.location}</div>
                                                </div>
                                                <div className={css.followerCount}>
                                                    <div className={css.followerNumber}>{story.followers}</div>
                                                    <div className={css.followerLabel}>Followers</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                )}
            </div>
        </section>
    );
};

export default SuccessStoriesTwo;
