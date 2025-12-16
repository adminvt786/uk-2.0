import {
  getAllTransitionsForEveryProcess,
  NEGOTIATION_PROCESS_NAME,
  PURCHASE_PROCESS_NAME,
} from '../../transactions/transaction';
import { transitions } from '../../transactions/transactionProcessPurchase';

const getHotelQueryParams = status => {
  const hotelStatusMap = {
    applications: { processNames: NEGOTIATION_PROCESS_NAME },
    creatorOutreach: { processNames: PURCHASE_PROCESS_NAME },
  };
  return hotelStatusMap[status] || {};
};

// Constants for transition groups
const FULFILLED_TRANSITIONS = [
  transitions.COMPLETE,
  transitions.COMPLETE_AFTER_REPORT_A_PROBLEM,
  transitions.REVIEW_1_BY_CUSTOMER,
  transitions.EXPIRE_REVIEW_PERIOD,
];

const getStandardQueryParams = status => {
  const allTransitions = getAllTransitionsForEveryProcess();

  const standardStatusMap = {
    all: { lastTransitions: allTransitions },
    inquiries: { lastTransitions: [transitions.INQUIRE] },
    fulfilled: { lastTransitions: FULFILLED_TRANSITIONS },
    paymentExpired: { lastTransitions: [transitions.EXPIRE_PAYMENT] },
    unfulfilled: {
      lastTransitions: allTransitions.filter(
        t => ![transitions.INQUIRE, ...FULFILLED_TRANSITIONS].includes(t)
      ),
    },
  };

  return standardStatusMap[status] || {};
};

export { getHotelQueryParams, getStandardQueryParams };
