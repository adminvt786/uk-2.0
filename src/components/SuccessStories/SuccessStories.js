import React, { useState } from 'react';
import css from './SuccessStories.module.css';
import successStoriesImage from '../../assets/succssStories.png';
import Field from '../../containers/PageBuilder/Field';

// Icon components
const OrganicReachIcon = () => (
  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="60" height="60" rx="30" fill="white" />
    <path
      d="M39.92 24.6184C39.8186 24.3741 39.6245 24.18 39.3802 24.0785C39.26 24.0273 39.1309 24.0001 39.0003 23.9985H34.0017C33.7366 23.9985 33.4823 24.1039 33.2948 24.2913C33.1074 24.4788 33.002 24.7331 33.002 24.9982C33.002 25.2634 33.1074 25.5177 33.2948 25.7051C33.4823 25.8926 33.7366 25.998 34.0017 25.998H36.591L31.0026 31.5863L27.7136 28.2873C27.6206 28.1936 27.5101 28.1192 27.3882 28.0685C27.2664 28.0177 27.1357 27.9916 27.0038 27.9916C26.8718 27.9916 26.7411 28.0177 26.6193 28.0685C26.4975 28.1192 26.3869 28.1936 26.294 28.2873L20.2957 34.2856C20.202 34.3785 20.1276 34.4891 20.0769 34.6109C20.0261 34.7327 20 34.8634 20 34.9953C20 35.1273 20.0261 35.258 20.0769 35.3798C20.1276 35.5016 20.202 35.6122 20.2957 35.7051C20.3886 35.7988 20.4992 35.8732 20.621 35.924C20.7429 35.9747 20.8735 36.0009 21.0055 36.0009C21.1375 36.0009 21.2681 35.9747 21.39 35.924C21.5118 35.8732 21.6224 35.7988 21.7153 35.7051L27.0038 30.4067L30.2928 33.7057C30.3857 33.7994 30.4963 33.8738 30.6181 33.9245C30.74 33.9753 30.8706 34.0014 31.0026 34.0014C31.1346 34.0014 31.2652 33.9753 31.3871 33.9245C31.5089 33.8738 31.6195 33.7994 31.7124 33.7057L38.0006 27.4075V29.9968C38.0006 30.2619 38.1059 30.5162 38.2934 30.7037C38.4809 30.8912 38.7351 30.9965 39.0003 30.9965C39.2654 30.9965 39.5197 30.8912 39.7072 30.7037C39.8947 30.5162 40 30.2619 40 29.9968V24.9982C39.9984 24.8676 39.9712 24.7385 39.92 24.6184Z"
      fill="#D9A441"
    />
  </svg>
);

const AssetsIcon = () => (
  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="60" height="60" rx="30" fill="white" />
    <path
      d="M39.1629 36.2226C39.2839 35.82 39.3499 35.3921 39.3499 34.9499V25.0499C39.3499 23.8829 38.8863 22.7638 38.0612 21.9386C37.236 21.1135 36.1169 20.6499 34.9499 20.6499H25.0499C23.8829 20.6499 22.7638 21.1135 21.9386 21.9386C21.1135 22.7638 20.6499 23.8829 20.6499 25.0499V35.0269C20.6701 36.1805 21.1426 37.2799 21.9655 38.0885C22.7885 38.8971 23.8962 39.3501 25.0499 39.3499H34.9499L35.0786 39.3477M39.1629 36.2226L39.0661 36.1082L36.3535 32.8346C36.1477 32.5863 35.8898 32.3863 35.5981 32.2487C35.3063 32.1111 34.9879 32.0394 34.6654 32.0385C34.3429 32.0377 34.0241 32.1078 33.7317 32.2438C33.4393 32.3799 33.1803 32.5786 32.9732 32.8258L31.53 34.5484L31.2946 34.8355M39.1629 36.2226C38.8961 37.1062 38.3581 37.8825 37.6251 38.4435C36.8921 39.0046 36.0013 39.3209 35.0786 39.3477M31.2946 34.8355L34.9763 39.2311L35.0786 39.3477M31.2946 34.8355L27.7449 30.5972C27.5384 30.3508 27.2804 30.1526 26.9891 30.0166C26.6977 29.8806 26.3801 29.8101 26.0586 29.8101C25.7371 29.8101 25.4195 29.8806 25.1281 30.0166C24.8368 30.1526 24.5788 30.3508 24.3723 30.5972L20.8457 34.8069L20.651 35.028"
      stroke="#D9A441"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M33.4 28.2502C34.3113 28.2502 35.05 27.5115 35.05 26.6002C35.05 25.6889 34.3113 24.9502 33.4 24.9502C32.4887 24.9502 31.75 25.6889 31.75 26.6002C31.75 27.5115 32.4887 28.2502 33.4 28.2502Z"
      fill="#D9A441"
    />
  </svg>
);

const ClicksIcon = () => (
  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="60" height="60" rx="30" fill="white" />
    <path
      d="M21 26.5699H23.6391M27.5978 22.873V20.2339M24.1859 23.4188L22.3196 21.5534M31.0097 23.4188L32.876 21.5534M30.0754 39.2208C29.2763 40.2606 27.6136 39.718 27.582 38.4069L27.3297 27.9982C27.3234 27.7483 27.3846 27.5014 27.5068 27.2835C27.629 27.0655 27.8077 26.8844 28.0241 26.7594C28.2405 26.6344 28.4866 26.5701 28.7365 26.5731C28.9864 26.5762 29.2308 26.6465 29.4441 26.7768L38.3327 32.1997C39.4517 32.8827 39.0906 34.5939 37.7911 34.7659L33.5823 35.3223C33.217 35.3708 32.8855 35.5619 32.6617 35.8533L30.0754 39.2208Z"
      stroke="#D9A441"
      strokeWidth="1.58347"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect
      x="-0.25"
      y="0.25"
      width="49.5"
      height="49.5"
      rx="24.75"
      transform="matrix(-1 0 0 1 49.5 0)"
      stroke="black"
      strokeOpacity="0.5"
      strokeWidth="0.5"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M22.3374 25.5555L26.7819 30L27.8928 28.8891L24.0038 25L27.8928 21.1109L26.7819 20L22.3374 24.4445C22.1901 24.5919 22.1073 24.7917 22.1073 25C22.1073 25.2083 22.1901 25.4081 22.3374 25.5555Z"
      fill="black"
    />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect
      x="0.25"
      y="0.25"
      width="49.5"
      height="49.5"
      rx="24.75"
      stroke="black"
      strokeOpacity="0.5"
      strokeWidth="0.5"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M27.6626 25.5555L23.2181 30L22.1072 28.8891L25.9962 25L22.1072 21.1109L23.2181 20L27.6626 24.4445C27.8099 24.5919 27.8927 24.7917 27.8927 25C27.8927 25.2083 27.8099 25.4081 27.6626 25.5555Z"
      fill="black"
    />
  </svg>
);

const SuccessStories = props => {
  const {
    title,
    description,
    options,
    sectionId,
    callToAction,
    blocks = [],
  } = props;
  const [currentSlide, setCurrentSlide] = useState(0);
  const fieldComponents = options?.fieldComponents;
  const fieldOptions = { fieldComponents };
  // Sample data - you can expand this with more stories
  const stories = [
    {
      id: 1,
      location: 'Maldives',
      title: 'Maldives Paradise Resort',
      kpis: [
        {
          icon: <OrganicReachIcon />,
          value: '120K',
          descriptor: 'IN 72 HOURS',
          label: 'Organic Reach',
        },
        {
          icon: <AssetsIcon />,
          value: '40',
          descriptor: 'DELIVERABLES',
          label: 'Assets',
        },
        {
          icon: <ClicksIcon />,
          value: '3.2K',
          descriptor: 'TO BOOKING',
          label: 'Clicks',
        },
      ],
      testimonial:
        'UKREATE CREATORS DELIVERED STUNNING CONTENT THAT EXCEEDED OUR EXPECTATIONS AND DROVE IMMEDIATE BOOKING INQUIRIES.',
      image: successStoriesImage,
    },
    {
      id: 2,
      location: 'Bali',
      title: 'Bali Luxury Villa',
      kpis: [
        {
          icon: <OrganicReachIcon />,
          value: '95K',
          descriptor: 'IN 48 HOURS',
          label: 'Organic Reach',
        },
        {
          icon: <AssetsIcon />,
          value: '35',
          descriptor: 'DELIVERABLES',
          label: 'Assets',
        },
        {
          icon: <ClicksIcon />,
          value: '2.8K',
          descriptor: 'TO BOOKING',
          label: 'Clicks',
        },
      ],
      testimonial:
        'EXCEPTIONAL CREATIVITY AND PROFESSIONALISM. THE CONTENT RESONATED PERFECTLY WITH OUR TARGET AUDIENCE.',
      image: successStoriesImage,
    },
  ];

  const handlePrevious = () => {
    setCurrentSlide(prev => (prev === 0 ? stories.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide(prev => (prev === stories.length - 1 ? 0 : prev + 1));
  };

  const currentStory = stories[currentSlide];

  return (
    <section className={css.successStories}>
      <div className={css.topSection}>
        {blocks.length > 0 && (
          <div className={css.faqCard}>
            {blocks.map((block, index) => {
              const blockId = block.blockId || `faq-${index}`;
              return (
                <Field key={blockId} data={block.title} className={css.subtitle} options={fieldOptions} />
              );
            })}
          </div>
        )}
        <Field data={title} className={css.mainTitle} options={fieldOptions} />
        <Field data={description} className={css.description} options={fieldOptions} />
      </div>
      <div className={css.container}>
        <div className={css.imageColumn}>
          <div className={css.imageWrapper}>
            <img
              src={currentStory.image}
              alt={currentStory.title}
              className={css.storyImage}
              key={currentSlide}
            />
            <div className={css.locationTag}>
              <span className={css.locationText}>{currentStory.location}</span>
            </div>
          </div>
        </div>

        <div className={css.contentColumn}>
          <div key={`content-${currentSlide}`} className={css.contentWrapper}>
            <h2 className={css.title}>{currentStory.title}</h2>

            <div className={css.kpis}>
              {currentStory.kpis.map((kpi, index) => (
                <div key={index} className={css.kpiItem}>
                  <div className={css.kpiIcon}>{kpi.icon}</div>
                  <div className={css.kpiContent}>
                    <div className={css.kpiValueRow}>
                      <span className={css.kpiValue}>{kpi.value}</span>
                      <span className={css.kpiDescriptor}>{kpi.descriptor}</span>
                    </div>
                    <div className={css.kpiLabel}>{kpi.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className={css.testimonial}>
              <p className={css.testimonialText}>"{currentStory.testimonial}"</p>
            </div>
          </div>

          <div className={css.navigation}>
            <button className={css.navButton} onClick={handlePrevious} aria-label="Previous story">
              <ArrowLeftIcon />
            </button>
            <button className={css.navButton} onClick={handleNext} aria-label="Next story">
              <ArrowRightIcon />
            </button>
          </div>
        </div>
      </div>

      <div className={css.bottomStrip}></div>
    </section>
  );
};

export default SuccessStories;
