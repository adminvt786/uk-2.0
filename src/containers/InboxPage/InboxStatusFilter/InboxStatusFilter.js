import React, { useState } from 'react';
import classNames from 'classnames';
import { FormattedMessage } from '../../../util/reactIntl';

import css from './InboxStatusFilter.module.css';

const creatorTabs = [
  {
    id: 'all',
    text: <FormattedMessage id="InboxPage.statusFilter.all" />,
    status: 'all',
  },
  {
    id: 'inquiries',
    text: <FormattedMessage id="InboxPage.statusFilter.inquiries" />,
    status: 'inquiries',
  },
  {
    id: 'unfulfilled',
    text: <FormattedMessage id="InboxPage.statusFilter.unfulfilled" />,
    status: 'unfulfilled',
  },
  {
    id: 'fulfilled',
    text: <FormattedMessage id="InboxPage.statusFilter.fulfilled" />,
    status: 'fulfilled',
  },
  {
    id: 'paymentExpired',
    text: <FormattedMessage id="InboxPage.statusFilter.paymentExpired" />,
    status: 'paymentExpired',
  },
];

const hotelTabs = [
  {
    id: 'all',
    text: <FormattedMessage id="InboxPage.statusFilter.all" />,
    status: 'all',
  },
  {
    id: 'applications',
    text: <FormattedMessage id="InboxPage.statusFilter.applications" />,
    status: 'applications',
  },
  {
    id: 'creatorOutreach',
    text: <FormattedMessage id="InboxPage.statusFilter.creatorOutreach" />,
    status: 'creatorOutreach',
  },
  // ...creatorTabs.filter(elm => elm.id !== 'all'),
];

const InboxStatusFilter = props => {
  const { onStatusChange, className, rootClassName, selectedStatus, isHotel } = props;

  const classes = classNames(rootClassName || css.root, className);

  const tabs = isHotel ? hotelTabs : creatorTabs;

  return (
    <div className={classes}>
      <div className={css.tabsContainer}>
        {tabs.map(tab => {
          const isSelected = selectedStatus === tab.status;
          const tabClasses = classNames(css.tab, {
            [css.selectedTab]: isSelected,
          });

          return (
            <button
              key={tab.id}
              className={tabClasses}
              onClick={() => onStatusChange(tab.status)}
              type="button"
            >
              {tab.text}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default InboxStatusFilter;
