import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { manageDisableScrolling } from '../../../../ducks/ui.duck';
import { Modal } from '../../../../components';
import MuxPlayer from '@mux/mux-player-react';

const PlayVideoModal = props => {
  const { openVideoModal, setOpenVideoModal } = props;
  const dispatch = useDispatch();
  const [playVideo, setPlayVideo] = useState(true);

  useEffect(() => {
    return () => {
      setPlayVideo(false);
    };
  }, []);

  return (
    <Modal
      id="VideoPlayModal"
      isOpen={!!openVideoModal}
      onClose={() => setOpenVideoModal(false)}
      onManageDisableScrolling={(componentId, disableScrolling) =>
        dispatch(manageDisableScrolling(componentId, disableScrolling))
      }
    >
      <MuxPlayer
        streamType="on-demand"
        playbackId={openVideoModal}
        primaryColor="#FFFFFF"
        secondaryColor="#000000"
        autoPlay={playVideo}
        muted={true}
      />
    </Modal>
  );
};

export default PlayVideoModal;
