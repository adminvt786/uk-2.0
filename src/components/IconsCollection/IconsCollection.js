import React from 'react';
import classNames from 'classnames';

import css from './IconsCollection.module.css';

const ICON_LOCATION = 'location';
const ICON_CATEGORY = 'category';
const ICON_DELIVERABLE = 'deliverable';
const ICON_HOTEL = 'hotel';
const ICON_CALENDAR = 'calendar';
const ICON_DOLLAR = 'dollar';
const ICON_HEART = 'heart';
const ICON_MORE = 'more';
export const AUDIENCE = 'audience';
export const HEART = 'heart';
export const HEART_ICON = 'heartIcon';
export const HEART_OUTLINE = 'heartOutline';
export const VIDEO_ICON = 'video';
export const PHOTO_ICON = 'photo';
export const BAG_ICON = 'bag';
export const PLAY_ICON = 'play';
export const PICTURES_ICON = 'pictures';
/**
 * Icon collection for filters and UI elements.
 *
 * @component
 * @param {Object} props
 * @param {string?} props.className add more style rules in addition to components own css.root
 * @param {string?} props.rootClassName overwrite components own css.root
 * @param {'location' | 'category' | 'deliverable' | 'hotel' | 'calendar' | 'dollar' | 'heart' | 'more' | 'video' | 'photo' | 'bag'} props.type icon type
 * @param {boolean?} props.filled for heart icon, whether it should be filled
 * @returns {JSX.Element} SVG icon
 */
const IconsCollection = props => {
  const { className, rootClassName, type = 'location', filled = false, style = {} } = props;
  const classes = classNames(rootClassName || css.root, className);
  const roleInfo = {
    role: 'img',
    ['aria-label']: type,
  };

  switch (type) {
    case PLAY_ICON:
      return (
        <svg
          width="80px"
          height="80px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          {...roleInfo}
        >
          <circle cx="12" cy="12" r="11" fill="grey" strokeWidth="1.5" />
          <path
            d="M9 17V7L17 12L9 17Z"
            fill="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case HEART_OUTLINE:
      return (
        <svg
          className={classes}
          viewBox="0 0 1024 1024"
          height="25px"
          width="25px"
          style={style}
          aria-hidden="true"
          {...roleInfo}
        >
          <path d="M923 283.6a260.04 260.04 0 00-56.9-82.8 264.4 264.4 0 00-84-55.5A265.34 265.34 0 00679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 00-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9zM512 814.8S156 586.7 156 385.5C156 283.6 240.3 201 344.3 201c73.1 0 136.5 40.8 167.7 100.4C543.2 241.8 606.6 201 679.7 201c104 0 188.3 82.6 188.3 184.5 0 201.2-356 429.3-356 429.3z" />
        </svg>
      );
    case HEART_ICON:
      return (
        <svg
          className={classes}
          viewBox="0 0 1024 1024"
          height="25px"
          width="25px"
          style={style}
          aria-hidden="true"
          {...roleInfo}
        >
          <path d="M923 283.6a260.04 260.04 0 00-56.9-82.8 264.4 264.4 0 00-84-55.5A265.34 265.34 0 00679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 00-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9z" />
        </svg>
      );

    case HEART:
      return (
        <svg
          className={classes}
          xmlns="http://www.w3.org/2000/svg"
          width="24px"
          height="24px"
          viewBox="0 0 64 64"
          enableBackground="new 0 0 64 64"
          aria-hidden="true"
          {...roleInfo}
        >
          <path
            fill="none"
            stroke="#1A98A6"
            strokeWidth="4"
            strokeMiterlimit="10"
            d="M32 59C32 59 3 45 3 22C3 12 10 5 19 5C25 5 30 9 32 13C34 9 39 5 45 5C54 5 61 12 61 22C61 45 32 59 32 59Z"
          />
        </svg>
      );

    case AUDIENCE:
      return (
        <svg
          width="18"
          height="15"
          viewBox="0 0 18 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          {...roleInfo}
        >
          <path
            d="M2.62464 4.12826C2.62479 3.41649 2.80893 2.71684 3.15919 2.09721C3.50945 1.47758 4.01393 0.959011 4.62369 0.59183C5.23345 0.22465 5.92776 0.0213254 6.63927 0.00158812C7.35077 -0.0181491 8.05529 0.146371 8.68446 0.479183C9.31364 0.811996 9.8461 1.3018 10.2302 1.90106C10.6142 2.50032 10.8369 3.18868 10.8765 3.89936C10.9161 4.61003 10.7713 5.31887 10.4562 5.9571C10.1411 6.59533 9.66638 7.14126 9.07809 7.54193C10.345 8.00659 11.4438 8.83976 12.2332 9.9342C13.0226 11.0286 13.4664 12.3343 13.5075 13.6831C13.5058 13.8285 13.4479 13.9676 13.346 14.0714C13.2441 14.1751 13.106 14.2355 12.9606 14.2398C12.8153 14.2442 12.6738 14.1922 12.5659 14.0948C12.458 13.9973 12.3918 13.8619 12.3814 13.7168C12.3367 12.254 11.7241 10.866 10.6736 9.84704C9.62299 8.82808 8.21694 8.25822 6.75339 8.25822C5.28984 8.25822 3.88379 8.82808 2.83322 9.84704C1.78264 10.866 1.1701 12.254 1.12539 13.7168C1.11787 13.8639 1.05308 14.0021 0.94488 14.1019C0.836683 14.2018 0.693693 14.2552 0.546542 14.2509C0.399392 14.2466 0.259785 14.1848 0.15763 14.0788C0.0554745 13.9728 -0.00110353 13.831 1.63121e-05 13.6838C0.0409707 12.3349 0.484706 11.0291 1.2741 9.93451C2.0635 8.83992 3.16243 8.00664 4.42944 7.54193C3.87319 7.16309 3.41798 6.65403 3.10342 6.05906C2.78886 5.4641 2.6245 4.80127 2.62464 4.12826ZM6.75376 1.12526C5.95732 1.12526 5.19349 1.44165 4.63032 2.00482C4.06715 2.56799 3.75076 3.33182 3.75076 4.12826C3.75076 4.92471 4.06715 5.68854 4.63032 6.25171C5.19349 6.81488 5.95732 7.13127 6.75376 7.13127C7.55021 7.13127 8.31403 6.81488 8.87721 6.25171C9.44038 5.68854 9.75676 4.92471 9.75676 4.12826C9.75676 3.33182 9.44038 2.56799 8.87721 2.00482C8.31403 1.44165 7.55021 1.12526 6.75376 1.12526ZM12.9775 4.12826C12.8669 4.12826 12.7583 4.13577 12.6517 4.15079C12.5772 4.16411 12.5009 4.16231 12.4272 4.14549C12.3534 4.12867 12.2839 4.09717 12.2226 4.05288C12.1613 4.00859 12.1096 3.9524 12.0705 3.88768C12.0314 3.82296 12.0057 3.75102 11.995 3.67617C11.9843 3.60131 11.9888 3.52507 12.0082 3.45199C12.0276 3.37891 12.0616 3.31049 12.108 3.25081C12.1544 3.19113 12.2124 3.14141 12.2785 3.10462C12.3445 3.06783 12.4173 3.04472 12.4925 3.03667C13.2392 2.92872 14.0006 3.07211 14.6568 3.44427C15.3131 3.81644 15.8269 4.39626 16.1176 5.09247C16.4082 5.78869 16.4591 6.56178 16.2622 7.29008C16.0653 8.01838 15.6319 8.66054 15.03 9.1155C15.9147 9.51163 16.6659 10.1553 17.1928 10.9688C17.7198 11.7824 18.0002 12.731 18 13.7003C18 13.8497 17.9407 13.9929 17.8351 14.0985C17.7295 14.2041 17.5863 14.2634 17.4369 14.2634C17.2876 14.2634 17.1444 14.2041 17.0388 14.0985C16.9332 13.9929 16.8739 13.8497 16.8739 13.7003C16.8741 12.8625 16.6044 12.0469 16.1045 11.3745C15.6047 10.7021 14.9015 10.2088 14.0991 9.9676L13.6982 9.84748V8.58922L14.006 8.43232C14.4623 8.20119 14.8274 7.82305 15.0423 7.35892C15.2572 6.8948 15.3094 6.37179 15.1906 5.87433C15.0717 5.37686 14.7886 4.93398 14.3871 4.61717C13.9855 4.30037 13.489 4.12813 12.9775 4.12826Z"
            fill="#fff"
          />
        </svg>
      );

    case ICON_LOCATION:
      return (
        <svg
          className={classes}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          {...roleInfo}
        >
          <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      );
    case ICON_CATEGORY:
      return (
        <svg
          className={classes}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          {...roleInfo}
        >
          <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"></path>
          <circle cx="7.5" cy="7.5" r=".5" fill="currentColor"></circle>
        </svg>
      );
    case ICON_DELIVERABLE:
      return (
        <svg
          className={classes}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          {...roleInfo}
        >
          <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"></path>
          <rect x="2" y="6" width="14" height="12" rx="2"></rect>
        </svg>
      );
    case ICON_HOTEL:
      return (
        <svg
          className={classes}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          {...roleInfo}
        >
          <path d="M10 12h4"></path>
          <path d="M10 8h4"></path>
          <path d="M14 21v-3a2 2 0 0 0-4 0v3"></path>
          <path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"></path>
          <path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"></path>
        </svg>
      );
    case ICON_CALENDAR:
      return (
        <svg
          className={classes}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          {...roleInfo}
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      );
    case ICON_DOLLAR:
      return (
        <svg
          className={classes}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          {...roleInfo}
        >
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      );
    case ICON_HEART:
      return (
        <svg
          className={classes}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill={filled ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          {...roleInfo}
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      );
    case ICON_MORE:
      return (
        <svg
          className={classes}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          {...roleInfo}
        >
          <circle cx="12" cy="12" r="1.5"></circle>
          <circle cx="12" cy="5" r="1.5"></circle>
          <circle cx="12" cy="19" r="1.5"></circle>
        </svg>
      );
    case VIDEO_ICON:
      return (
        <svg
          className={classes}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          {...roleInfo}
        >
          <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"></path>
          <rect x="2" y="6" width="14" height="12" rx="2"></rect>
        </svg>
      );
    case PHOTO_ICON:
      return (
        <svg
          className={classes}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          {...roleInfo}
        >
          <path d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z"></path>
          <circle cx="12" cy="13" r="3"></circle>
        </svg>
      );
    case BAG_ICON:
      return (
        <svg
          className={classes}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          {...roleInfo}
        >
          <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          <rect width="20" height="14" x="2" y="6" rx="2"></rect>
        </svg>
      );
    case PICTURES_ICON:
      return (
        <svg
          className={classes}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          {...roleInfo}
        >
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
          <circle cx="9" cy="9" r="2"></circle>
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
        </svg>
      );
    default:
      return null;
  }
};

export default IconsCollection;
