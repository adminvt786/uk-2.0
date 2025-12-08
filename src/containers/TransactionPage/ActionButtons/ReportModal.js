import classNames from 'classnames';
import { Form as FinalForm } from 'react-final-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { FieldTextInput, Form, Modal, PrimaryButton, SecondaryButton } from '../../../components';
import css from './ReportModal.module.css';

const ReportModal = props => {
  const { isModalOpen, onClose, onManageDisableScrolling, onSubmit } = props;
  const intl = useIntl();

  let loading;
  return (
    <Modal
      id="ReportModal"
      isOpen={isModalOpen}
      onClose={onClose}
      usePortal
      onManageDisableScrolling={onManageDisableScrolling}
    >
      <div className={css.termsWrapper}>
        <FinalForm
          onSubmit={onSubmit}
          render={formRenderProps => {
            const {
              rootClassName,
              className,
              submitButtonWrapperClassName,
              formId,
              handleSubmit,
              values,
            } = formRenderProps;

            const { issue } = values;
            const classes = classNames(rootClassName || css.root, className);
            const submitDisabled = !issue;

            return (
              <Form className={classes} onSubmit={handleSubmit}>
                <div className={css.section}>
                  <FieldTextInput
                    className={css.inputField}
                    name="issue"
                    id={formId ? `${formId}.issue` : 'issue'}
                    placeholder={intl.formatMessage({
                      id: 'ReportModal.issuePlaceholder',
                    })}
                    label={intl.formatMessage({ id: 'ReportModal.issueLabel' })}
                    type="textarea"
                  />
                </div>

                <div className={submitButtonWrapperClassName}>
                  <div className={css.buttonWrapper}>
                    <SecondaryButton type="button" onClick={onClose}>
                      <FormattedMessage id="ReportModal.cancelButtonText" />
                    </SecondaryButton>
                    <PrimaryButton type="submit" disabled={submitDisabled} inProgress={loading}>
                      <FormattedMessage id="ReportModal.submitButtonText" />
                    </PrimaryButton>
                  </div>
                </div>
              </Form>
            );
          }}
        />
      </div>
    </Modal>
  );
};

export default ReportModal;
