import React, { useState } from 'react';
import classNames from 'classnames';

import { FormattedMessage, useIntl } from '../../../util/reactIntl';
import { pickCategoryFields } from '../../../util/fieldHelpers';

import { Modal, H3 } from '../../../components';

import CreateRequestForm from './CreateRequestForm';
import css from './CreateRequestModal.module.css';
import {
  initialValuesForListingFields,
  pickListingFieldsData,
} from '../../EditListingPage/EditListingWizard/EditListingDetailsPanel/EditListingDetailsPanel';
import moment from 'moment';
import {
  createRequestListing,
  loadData,
  requestListingSelector,
  updateRequestListing,
} from '../ManageListingsPage.duck';
import { useDispatch, useSelector } from 'react-redux';
import { types as sdkTypes } from '../../../util/sdkLoader';
import { LISTING_STATE_PENDING_APPROVAL, LISTING_STATE_PUBLISHED } from '../../../util/types';

const { Money } = sdkTypes;

/**
 * Get listing configuration. For new requests, the data needs to be figured out from listingTypes configuration.
 * We select first type in the array if only one type is available.
 *
 * @param {Array} listingTypes
 * @returns an object containing mainly information that can be stored to publicData.
 */
const getTransactionInfo = (listingTypes, inlcudeLabel = false) => {
  if (listingTypes.length === 1) {
    const { listingType: type, label, transactionType } = listingTypes[0];
    const { alias, unitType: configUnitType } = transactionType;
    const labelMaybe = inlcudeLabel ? { label: label || type } : {};
    return {
      listingType: type,
      transactionProcessAlias: alias,
      unitType: configUnitType,
      ...labelMaybe,
    };
  }
  return {};
};

const getInitialValues = (requestListing, listingFields, listingCategories, categoryKey) => {
  const { description, title, publicData, geolocation, price } = requestListing?.attributes || {};
  const {
    listingType = 'hotels',
    transactionProcessAlias = 'default-negotiation/release-1',
    unitType = 'request',
    location,
    startDate,
    endDate,
  } = publicData || {};
  const locationFieldsPresent = publicData?.location?.address && geolocation;
  const { address } = location || {};

  const nestedCategories = pickCategoryFields(publicData, categoryKey, 1, listingCategories);

  return {
    title,
    price,
    description: description ?? '',
    listingType,
    transactionProcessAlias,
    unitType,
    ...nestedCategories,
    ...initialValuesForListingFields(
      publicData,
      'public',
      listingType,
      nestedCategories,
      listingFields
    ),
    location: locationFieldsPresent
      ? {
          search: address,
          selectedPlace: { address, origin: geolocation },
        }
      : { search: undefined, selectedPlace: undefined },
    startDate: startDate ? { date: new Date(startDate * 1000) } : null,
    endDate: endDate ? { date: new Date(endDate * 1000) } : null,
  };
};

const CreateRequestModal = props => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const {
    className,
    rootClassName,
    id,
    isOpen,
    onCloseModal,
    onManageDisableScrolling,
    config,
    error,
    inProgress,
    editListingId,
  } = props;
  const requestListing = useSelector(state => requestListingSelector(state, editListingId));
  const classes = classNames(rootClassName || css.root, className);

  const listingTypes =
    config?.listing?.listingTypes?.filter(elm => elm.listingType === 'hotels') || [];
  const listingFields = config?.listing?.listingFields || [];
  const listingCategories = config?.categoryConfiguration?.categories || [];
  const categoryKey = config?.categoryConfiguration?.key;
  const [initialValues, setInitialValues] = useState(
    getInitialValues(requestListing, listingFields, listingCategories, categoryKey)
  );

  const handleSubmit = async values => {
    const {
      title,
      description,
      listingType,
      transactionProcessAlias,
      unitType,
      location,
      startDate,
      endDate,
      price,
      ...rest
    } = values;

    const nestedCategories = pickCategoryFields(rest, categoryKey, 1, listingCategories);
    // Remove old categories by explicitly saving null for them.
    const cleanedNestedCategories = {
      ...[1, 2, 3].reduce((a, i) => ({ ...a, [`${categoryKey}${i}`]: null }), {}),
      ...nestedCategories,
    };
    const publicListingFields = pickListingFieldsData(
      rest,
      'public',
      listingType,
      nestedCategories,
      listingFields
    );

    const address = location?.selectedPlace?.address || null;
    const origin = location?.selectedPlace?.origin || null;
    const locationDataMaybe = address ? { location: { address } } : {};

    // Prepare values for submission
    const updateValues = {
      price: price ? price : new Money(0, config?.currency),
      geolocation: origin,
      title: title.trim(),
      description: description?.trim() || '',
      publicData: {
        listingType,
        transactionProcessAlias,
        unitType,
        ...cleanedNestedCategories,
        ...publicListingFields,
        ...locationDataMaybe,
        startDate: moment(startDate.date).unix(),
        endDate: moment(endDate.date).unix(),
      },
    };

    setInitialValues({
      title,
      description,
      listingType,
      transactionProcessAlias,
      unitType,
      location,
      startDate,
      endDate,
      price,
      ...rest,
    });

    if (requestListing?.id?.uuid) {
      await dispatch(
        updateRequestListing({ data: { id: requestListing.id.uuid, ...updateValues }, config })
      );
    } else {
      await dispatch(createRequestListing({ data: updateValues, config }));
    }
    await dispatch(loadData(null, 'manageListingsPage', config));

    onCloseModal();
  };

  return (
    <Modal
      id={id}
      containerClassName={classes}
      contentClassName={css.modalContent}
      isOpen={isOpen}
      onClose={onCloseModal}
      onManageDisableScrolling={onManageDisableScrolling}
      usePortal
      closeButtonMessage={intl.formatMessage({ id: 'CreateRequestModal.close' })}
    >
      <H3 as="h2" className={css.modalTitle}>
        <FormattedMessage id="CreateRequestModal.title" />
      </H3>
      <p className={css.modalMessage}>
        <FormattedMessage id="CreateRequestModal.message" />
      </p>

      <CreateRequestForm
        className={css.form}
        initialValues={initialValues}
        saveActionMsg={intl.formatMessage({
          id: [LISTING_STATE_PUBLISHED, LISTING_STATE_PENDING_APPROVAL].includes(
            requestListing?.attributes?.state
          )
            ? 'CreateRequestModal.update'
            : 'CreateRequestModal.submit',
        })}
        onSubmit={handleSubmit}
        selectableListingTypes={listingTypes.map(conf => getTransactionInfo([conf], true))}
        hasExistingListingType={false}
        selectableCategories={listingCategories}
        pickSelectedCategories={values =>
          pickCategoryFields(values, categoryKey, 1, listingCategories)
        }
        categoryPrefix={categoryKey}
        onListingTypeChange={() => {}}
        listingFieldsConfig={listingFields}
        marketplaceCurrency={config?.currency}
        marketplaceName={config?.marketplaceName}
        disabled={false}
        ready={false}
        updated={false}
        updateInProgress={inProgress}
        fetchErrors={{ createRequestError: error }}
      />
    </Modal>
  );
};

export default CreateRequestModal;
