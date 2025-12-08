import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FormattedMessage } from '../../../util/reactIntl';
import { manageDisableScrolling } from '../../../ducks/ui.duck';
import VideoPreviewModal from './VideoPreviewModal';
import { ExternalLink } from '../../../components';

function ContentSubmissions({ protectedData }) {
  const dispatch = useDispatch();
  const [isOpenVideoModal, setIsOpenVideoModal] = useState(null);
  const { submittedContent } = protectedData;

  if (!submittedContent || submittedContent.length === 0) {
    return null;
  }

  return (
    <div>
      <h4>
        <FormattedMessage id="TransactionPanel.ContentSubmissions.heading" />
      </h4>
      <ol>
        {submittedContent.map(({ playback_id, originalPlaybackId, status, issue }, index) => (
          <li key={index}>
            <p>
              {status !== 'approved' ? (
                <span
                  style={{ cursor: 'pointer', textDecoration: 'underline', color: '#7C3AED' }}
                  onClick={() => setIsOpenVideoModal(playback_id)}
                >
                  <FormattedMessage id="TransactionPanel.ContentSubmissions.watchHere" />
                </span>
              ) : (
                <ExternalLink href={`https://stream.mux.com/${originalPlaybackId}/highest.mp4`}>
                  <FormattedMessage id="TransactionPanel.ContentSubmissions.downloadHere" />
                </ExternalLink>
              )}{' '}
              ({status === 'problem-reported' ? 'A change request has been made' : status})
            </p>
            {issue && status !== 'approved' && (
              <p>
                <span style={{ color: 'red' }}>
                  <FormattedMessage id="TransactionPanel.ContentSubmissions.editRequest" />
                </span>{' '}
                {issue}
              </p>
            )}
            {issue && submittedContent.length - 1 === index && status !== 'approved' && (
              <small>
                <FormattedMessage id="TransactionPanel.ContentSubmissions.replyInstructions" />
              </small>
            )}
          </li>
        ))}
      </ol>

      {isOpenVideoModal ? (
        <VideoPreviewModal
          isModalOpen={isOpenVideoModal}
          onClose={() => setIsOpenVideoModal(null)}
          onManageDisableScrolling={(componentId, disableScrolling) =>
            dispatch(manageDisableScrolling(componentId, disableScrolling))
          }
        />
      ) : null}
    </div>
  );
}

export default ContentSubmissions;
