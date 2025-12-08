import css from './VideoPreviewModal.module.css';
import MuxPlayer from '@mux/mux-player-react';
import { Modal } from '../../../components';

function VideoPreviewModal(props) {
  const { isModalOpen, onClose, onManageDisableScrolling } = props;

  return (
    <Modal
      id="VideoPreviewModal"
      isOpen={isModalOpen}
      onClose={onClose}
      usePortal
      onManageDisableScrolling={onManageDisableScrolling}
    >
      <div className={css.muxVideoPlayer}>
        <MuxPlayer
          streamType="on-demand"
          playbackId={isModalOpen}
          primaryColor="#FFFFFF"
          secondaryColor="#000000"
          muted={false}
          thumbnailTime={1}
        />
      </div>
    </Modal>
  );
}

export default VideoPreviewModal;
