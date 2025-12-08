/**
 * Transaction process graph for product orders:
 *   - default-purchase
 */

/**
 * Transitions
 *
 * These strings must sync with values defined in Marketplace API,
 * since transaction objects given by API contain info about last transitions.
 * All the actions in API side happen in transitions,
 * so we need to understand what those strings mean.
 */

export const transitions = {
  // When a customer makes an order for a listing, a transaction is
  // created with the initial request-payment transition.
  // At this transition a PaymentIntent is created by Marketplace API.
  // After this transition, the actual payment must be made on client-side directly to Stripe.
  REQUEST_PAYMENT: 'transition/request-payment',

  // A customer can also initiate a transaction with an inquiry, and
  // then transition that with a request.
  INQUIRE: 'transition/inquire',
  REQUEST_PAYMENT_AFTER_INQUIRY: 'transition/request-payment-after-inquiry',

  // Stripe SDK might need to ask 3D security from customer, in a separate front-end step.
  // Therefore we need to make another transition to Marketplace API,
  // to tell that the payment is confirmed.
  CONFIRM_PAYMENT: 'transition/confirm-payment',

  // If the payment is not confirmed in the time limit set in transaction process (by default 15min)
  // the transaction will expire automatically.
  EXPIRE_PAYMENT: 'transition/expire-payment',

  // Provider can accept or decline the purchase
  ACCEPT: 'transition/accept',
  DECLINE: 'transition/decline',

  // Transaction can expire if provider doesn't accept it
  EXPIRE: 'transition/expire',

  SUBMIT_SERVICE: 'transition/submit-service',

  // After the purchase is accepted, either party can report problems
  CUSTOMER_REPORT_PROBLEM: 'transition/customer-report-a-problem',
  SUBMIT_SERVICE_AFTER_PROBLEM_FIX: 'transition/submit-service-after-problem-fix',

  // When everything goes well, customer can complete the transaction
  COMPLETE: 'transition/complete',
  COMPLETE_AFTER_REPORT_A_PROBLEM: 'transition/complete-after-report-a-problem',

  // Reviews are given through transaction transitions
  REVIEW_1_BY_CUSTOMER: 'transition/review-1-by-customer',
  EXPIRE_REVIEW_PERIOD: 'transition/expire-review-period',
};

/**
 * States
 *
 * These constants are only for making it clear how transitions work together.
 * You should not use these constants outside of this file.
 *
 * Note: these states are not in sync with states used transaction process definitions
 *       in Marketplace API. Only last transitions are passed along transaction object.
 */

export const states = {
  INITIAL: 'initial',
  INQUIRY: 'inquiry',
  PENDING_PAYMENT: 'pending-payment',
  PAYMENT_EXPIRED: 'payment-expired',
  PURCHASED: 'purchased',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
  EXPIRED: 'expired',
  SERVICE_SUBMITTED: 'service-submitted',
  PROBLEM_REPORTED: 'problem-reported',
  COMPLETED: 'completed',
  REVIEWED: 'reviewed',
};

/**
 * Description of transaction process graph
 *
 * You should keep this in sync with transaction process defined in Marketplace API
 *
 * Note: we don't use yet any state machine library,
 *       but this description format is following Xstate (FSM library)
 *       https://xstate.js.org/docs/
 */
export const graph = {
  // id is defined only to support Xstate format.
  // However if you have multiple transaction processes defined,
  // it is best to keep them in sync with transaction process aliases.
  id: 'default-purchase/release-1',

  // This 'initial' state is a starting point for new transaction
  initial: states.INITIAL,

  // States
  states: {
    [states.INITIAL]: {
      on: {
        [transitions.INQUIRE]: states.INQUIRY,
        [transitions.REQUEST_PAYMENT]: states.PENDING_PAYMENT,
      },
    },
    [states.INQUIRY]: {
      on: {
        [transitions.REQUEST_PAYMENT_AFTER_INQUIRY]: states.PENDING_PAYMENT,
      },
    },

    [states.PENDING_PAYMENT]: {
      on: {
        [transitions.EXPIRE_PAYMENT]: states.PAYMENT_EXPIRED,
        [transitions.CONFIRM_PAYMENT]: states.PURCHASED,
      },
    },

    [states.PAYMENT_EXPIRED]: {},

    [states.PURCHASED]: {
      on: {
        [transitions.ACCEPT]: states.ACCEPTED,
        [transitions.DECLINE]: states.DECLINED,
        [transitions.EXPIRE]: states.EXPIRED,
      },
    },

    [states.DECLINED]: {},
    [states.EXPIRED]: {},
    [states.ACCEPTED]: {
      on: {
        [transitions.SUBMIT_SERVICE]: states.SERVICE_SUBMITTED,
      },
    },

    [states.SERVICE_SUBMITTED]: {
      on: {
        [transitions.COMPLETE]: states.COMPLETED,
        [transitions.CUSTOMER_REPORT_PROBLEM]: states.PROBLEM_REPORTED,
      },
    },

    [states.PROBLEM_REPORTED]: {
      on: {
        [transitions.SUBMIT_SERVICE_AFTER_PROBLEM_FIX]: states.SERVICE_SUBMITTED,
        [transitions.COMPLETE_AFTER_REPORT_A_PROBLEM]: states.COMPLETED,
      },
    },

    [states.COMPLETED]: {
      on: {
        [transitions.EXPIRE_REVIEW_PERIOD]: states.REVIEWED,
        [transitions.REVIEW_1_BY_CUSTOMER]: states.REVIEWED,
      },
    },

    [states.REVIEWED]: { type: 'final' },
  },
};

// Check if a transition is the kind that should be rendered
// when showing transition history (e.g. ActivityFeed)
// The first transition and most of the expiration transitions made by system are not relevant
export const isRelevantPastTransition = transition => {
  return [
    transitions.CONFIRM_PAYMENT,
    transitions.ACCEPT,
    transitions.DECLINE,
    transitions.SUBMIT_SERVICE,
    transitions.COMPLETE,
    transitions.COMPLETE_AFTER_REPORT_A_PROBLEM,
    transitions.CUSTOMER_REPORT_PROBLEM,
    transitions.SUBMIT_SERVICE_AFTER_PROBLEM_FIX,
    transitions.REVIEW_1_BY_CUSTOMER,
  ].includes(transition);
};
export const isCustomerReview = transition => {
  return [transitions.REVIEW_1_BY_CUSTOMER].includes(transition);
};

export const isProviderReview = transition => {
  return false;
};

// Check if the given transition is privileged.
//
// Privileged transitions need to be handled from a secure context,
// i.e. the backend. This helper is used to check if the transition
// should go through the local API endpoints, or if using JS SDK is
// enough.
export const isPrivileged = transition => {
  return [transitions.REQUEST_PAYMENT, transitions.REQUEST_PAYMENT_AFTER_INQUIRY].includes(
    transition
  );
};

// Check when transaction is completed (item is received and review notifications sent)
export const isCompleted = transition => {
  const txCompletedTransitions = [
    transitions.COMPLETE,
    transitions.COMPLETE_AFTER_REPORT_A_PROBLEM,
    transitions.REVIEW_1_BY_CUSTOMER,
    transitions.EXPIRE_REVIEW_PERIOD,
  ];
  return txCompletedTransitions.includes(transition);
};

// Check when transaction is refunded (order did not happen)
// In these transitions action/stripe-refund-payment is called
export const isRefunded = transition => {
  const txRefundedTransitions = [
    transitions.EXPIRE_PAYMENT,
    transitions.DECLINE,
    transitions.EXPIRE,
  ];
  return txRefundedTransitions.includes(transition);
};

export const statesNeedingProviderAttention = [states.PURCHASED];
