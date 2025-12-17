import { useState } from 'react';
import {
  FieldLocationAutocompleteInput,
  Form,
  IconClose,
  IconsCollection,
} from '../../../components';
import css from './HotelsRequestsSearchPage.module.css';
import { Form as FinalForm, FormSpy } from 'react-final-form';
import classNames from 'classnames';
import {
  autocompletePlaceSelected,
  autocompleteSearchRequired,
  composeValidators,
} from '../../../util/validators';
import FieldSelectIntegerRange from '../IntegerRangeFilter/FieldSelectIntegerRange';
import IntegerRangeFilter from '../IntegerRangeFilter/IntegerRangeFilter';
import PriceFilter from '../PriceFilter/PriceFilter';
import { isOriginInUse } from '../../../util/search';

const FilterDropdown = ({ label, placeholder, options, value, onChange, icon }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = option => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className={css.filterItem}>
      <label className={css.filterLabel}>
        {icon && <IconsCollection type={icon} className={css.labelIcon} />}
        {label}
      </label>
      <div className={css.dropdownWrapper}>
        <button className={css.dropdownButton} onClick={() => setIsOpen(!isOpen)} type="button">
          <span className={css.dropdownText}>{value?.label || placeholder}</span>
          <span className={css.chevron}>{isOpen ? '▲' : '▼'}</span>
        </button>
        {isOpen && (
          <div className={css.dropdownMenu}>
            {options?.map((elm, index) => (
              <div key={elm.option} className={css.dropdownItem} onClick={() => handleSelect(elm)}>
                {elm.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const LocationFilterForm = props => {
  return (
    <FinalForm
      onSubmit={() => {}}
      initialValues={{
        location: null,
      }}
      {...props}
      render={fieldRenderProps => {
        const { values, intl, handleSubmit, handleChange } = fieldRenderProps;
        const addressRequiredMessage = intl.formatMessage({
          id: 'EditListingDeliveryForm.addressRequired',
        });
        const addressNotRecognizedMessage = intl.formatMessage({
          id: 'EditListingDeliveryForm.addressNotRecognized',
        });
        return (
          <Form className={classNames(css.locationFilterForm)} onSubmit={handleSubmit}>
            <FormSpy onChange={handleChange} subscription={{ values: true, dirty: true }} />

            <FieldLocationAutocompleteInput
              hideErrorMessage
              rootClassName={css.input}
              inputClassName={css.locationAutocompleteInput}
              iconClassName={css.locationAutocompleteInputIcon}
              predictionsClassName={css.predictionsRoot}
              labelClassName={classNames(css.filterLabel, css.locationAutocompleteInputLabel)}
              validClassName={css.validLocation}
              name="location"
              id="location"
              label={
                <span className={css.locationAutocompleteInputLabelText}>
                  <IconsCollection type="location" className={css.featureIcon} />
                  <span>{intl.formatMessage({ id: 'EditListingDeliveryForm.address' })}</span>
                </span>
              }
              placeholder={intl.formatMessage({
                id: 'EditListingDeliveryForm.addressPlaceholder',
              })}
              useDefaultPredictions={false}
              format={v => v}
              valueFromForm={values.location}
              validate={composeValidators(
                autocompleteSearchRequired(addressRequiredMessage),
                autocompletePlaceSelected(addressNotRecognizedMessage)
              )}
              // Whatever parameters are being used to calculate
              // the validation function need to be combined in such
              // a way that, when they change, this key prop
              // changes, thus reregistering this field (and its
              // validation function) with Final Form.
              // See example: https://codesandbox.io/s/changing-field-level-validators-zc8ei
              key="locationValidation"
            />
          </Form>
        );
      }}
    />
  );
};

const formatQueryParam = queryParam => {
  return queryParam?.replace('has_all:', '')?.replace('has_any:', '');
};

const FilterForm = props => {
  const {
    categories,
    deliverableTypeOptions,
    hotelTypeOptions,
    className,
    intl,
    getHandleChangedValueFn,
    validQueryParams,
    appConfig,
  } = props;
  const selectedCategory = categories.find(
    cat => cat.id === formatQueryParam(validQueryParams.pub_categoryLevel1)
  );
  const selectedDeliverableType = deliverableTypeOptions.find(
    type => type.option === formatQueryParam(validQueryParams.pub_deliverable_type)
  );
  const selectedHotelType = hotelTypeOptions.find(
    type => type.option === formatQueryParam(validQueryParams.pub_hotel_type)
  );
  const selectedPrice = validQueryParams.price
    ? validQueryParams.price.split(',').join(' - ')
    : null;

  const selectedAddress = validQueryParams.address ? validQueryParams.address : null;
  console.log({ validQueryParams });
  return (
    <div className={classNames(css.filterForm, className)}>
      <div className={classNames(css.filterContainer)}>
        <LocationFilterForm
          intl={intl}
          initialValues={{
            location: selectedAddress
              ? {
                  search: selectedAddress,
                  selectedPlace: {
                    origin: isOriginInUse(appConfig) ? validQueryParams.origin : null,
                    bounds: validQueryParams.bounds,
                  },
                }
              : null,
          }}
          handleChange={form => {
            if (form.dirty && form.values.location.selectedPlace) {
              // topbar search defaults to 'location' search
              const { search, selectedPlace } = form.values.location || {};
              const { origin, bounds } = selectedPlace || {};
              const originMaybe = isOriginInUse(appConfig) ? { origin } : {};

              const location = {
                ...originMaybe,
                address: search,
                bounds,
              };
              getHandleChangedValueFn(true)(location);
            }
          }}
        />
        <FilterDropdown
          label="Category"
          placeholder="All categories"
          options={categories.map(cat => ({ option: cat.id, label: cat.name }))}
          value={
            validQueryParams.pub_categoryLevel1
              ? {
                  option: formatQueryParam(validQueryParams.pub_categoryLevel1),
                  label: selectedCategory?.name,
                }
              : null
          }
          onChange={value => {
            getHandleChangedValueFn(true)({ pub_categoryLevel1: value.option });
          }}
          icon="category"
        />
        <FilterDropdown
          label="Deliverable Type"
          placeholder="All types"
          options={deliverableTypeOptions}
          value={
            validQueryParams.pub_deliverable_type
              ? {
                  option: formatQueryParam(validQueryParams.pub_deliverable_type),
                  label: selectedDeliverableType?.label,
                }
              : null
          }
          onChange={value => {
            getHandleChangedValueFn(true)({ pub_deliverable_type: value.option });
          }}
          icon="deliverable"
        />
        <FilterDropdown
          label="Hotel Type"
          placeholder="All types"
          options={hotelTypeOptions}
          value={
            validQueryParams.pub_hotel_type
              ? {
                  option: formatQueryParam(validQueryParams.pub_hotel_type),
                  label: selectedHotelType?.label,
                }
              : null
          }
          onChange={value => {
            getHandleChangedValueFn(true)({ pub_hotel_type: value.option });
          }}
          icon="hotel"
        />
        <div className={css.compensationFilterWrapper}>
          <label className={css.filterLabel}>
            <IconsCollection type="dollar" className={css.labelIcon} />
            Compensation
          </label>
          <PriceFilter
            id="price"
            className={css.compensationFilter}
            outsideClickHandlerClassName={css.compensationFilterOutsideClickHandler}
            name={'price'}
            label={
              <span className={css.filterLabel}>
                {selectedPrice ? `${selectedPrice} USD` : 'Compensation'}
              </span>
            }
            queryParamNames={['price']}
            initialValues={{
              price: validQueryParams.price,
            }}
            onSubmit={values => {
              getHandleChangedValueFn(true)({ price: values.price });
            }}
            min={0}
            max={10000}
            step={100}
            marketplaceCurrency="USD"
          />
        </div>
      </div>
      <div className={css.selectedFilters}>
        {[
          ...(selectedCategory ? [{ key: 'pub_categoryLevel1', ...selectedCategory }] : []),
          ...(selectedDeliverableType
            ? [{ key: 'pub_deliverable_type', ...selectedDeliverableType }]
            : []),
          ...(selectedHotelType ? [{ key: 'pub_hotel_type', ...selectedHotelType }] : []),
        ].map(filter => (
          <div
            role="button"
            onClick={() => {
              getHandleChangedValueFn(true)({ [filter.key]: null });
            }}
            className={css.selectedFilter}
            key={filter.key}
          >
            <span className={css.selectedFilterLabel}>{filter.name || filter.label}</span>
            <IconClose className={css.selectedFilterCloseIcon} />
          </div>
        ))}
        {selectedPrice && (
          <div
            role="button"
            onClick={() => {
              getHandleChangedValueFn(true)({ price: null });
            }}
            className={css.selectedFilter}
          >
            <span className={css.selectedFilterLabel}>{selectedPrice} USD</span>
            <IconClose className={css.selectedFilterCloseIcon} />
          </div>
        )}
        {selectedAddress && (
          <div
            role="button"
            onClick={() => {
              getHandleChangedValueFn(true)({ address: null, bounds: null });
            }}
            className={css.selectedFilter}
          >
            <span className={css.selectedFilterLabel}>{selectedAddress}</span>
            <IconClose className={css.selectedFilterCloseIcon} />
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterForm;
