import React, { useState } from 'react';
import classNames from 'classnames';
import { FormattedMessage } from '../../../util/reactIntl';

import css from './InboxStatusFilter.module.css';

const InboxStatusFilter = props => {
  const { onStatusChange, className, rootClassName, selectedStatus } = props;

  const classes = classNames(rootClassName || css.root, className);

  const tabs = [
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
  ];

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
