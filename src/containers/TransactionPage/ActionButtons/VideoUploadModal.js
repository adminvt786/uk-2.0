import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Modal, PrimaryButton, SecondaryButton } from '../../../components';
import { getMuxAsset, getMuxUploadUrl, getMuxUploadUrlWatermark } from '../../../util/api';
import { performUpload } from './helper';
import css from './VideoUploadModal.module.css';

function VideoUploadModal(props) {
  const { isModalOpen, onClose, onManageDisableScrolling, onSubmit, txId } = props;

  const [selectedFile, setSelectedFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [uploadStage, setUploadStage] = useState(''); // 'uploading' or 'processing'

  // Handle file selection
  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);

      // Create video preview URL (only for smaller files to avoid performance issues)
      if (file.size < 100 * 1024 * 1024) {
        // Only preview if less than 100MB
        const previewUrl = URL.createObjectURL(file);
        setVideoPreview(previewUrl);
      }
    }
  };

  // Reset to initial state
  const handleReset = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setError(null);
    setUploadStage('');
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
      setVideoPreview(null);
    }
  };

  // Handle upload confirmation
  const handleConfirmUpload = async () => {
    if (!selectedFile) {
      setError('No file selected.');
      return;
    }

    if (loading) {
      return;
    }

    setLoading(true);
    setError(null);
    setUploadProgress(0);
    setUploadStage('');

    try {
      // Fetch both URLs in parallel
      const [mainUpload, watermarkUpload] = await Promise.all([
        getMuxUploadUrl({ txId: txId.uuid }),
        getMuxUploadUrlWatermark({ txId: txId.uuid }),
      ]);

      // Stage 1: Upload main asset
      setUploadStage('uploading');
      setUploadProgress(0);

      await performUpload(mainUpload.url, selectedFile, setUploadProgress);

      // Stage 2: Upload watermarked version
      setUploadStage('processing');
      setUploadProgress(0);

      await performUpload(watermarkUpload.url, selectedFile, setUploadProgress);

      // Fetch asset details for watermark upload
      const watermarkAsset = await getMuxAsset({ uploadId: watermarkUpload.id });

      // Final completion
      setUploadProgress(100);
      setLoading(false);
      setUploadStage('');

      if (onSubmit) {
        onSubmit({ ...watermarkAsset, originalId: mainUpload.id });
      }
    } catch (error) {
      console.error('❌ Upload error:', error);
      setError(error.detail || error.message || 'Upload failed. Please try again.');
      setLoading(false);
      setUploadProgress(0);
      setUploadStage('');
    }
  };

  // Handle modal close
  const handleClose = () => {
    handleReset();
    onClose();
  };

  // Format file size
  const formatFileSize = bytes => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Modal
      id="VideoUploadModal"
      isOpen={isModalOpen}
      onClose={handleClose}
      usePortal
      onManageDisableScrolling={onManageDisableScrolling}
    >
      <div className={css.modalContent}>
        <div className={css.header}>
          <h2 className={css.title}>
            <FormattedMessage id="VideoUploadModal.title" />
          </h2>
        </div>

        {!selectedFile ? (
          // Step 1: File input
          <div className={css.uploadSection}>
            <label htmlFor="video-file-input" className={css.uploadLabel}>
              <div className={css.uploadArea}>
                <p className={css.uploadText}>
                  <FormattedMessage id="VideoUploadModal.dragDrop" />
                </p>
              </div>
            </label>
            <input
              id="video-file-input"
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className={css.fileInput}
            />
          </div>
        ) : (
          // Step 2: Preview with details
          <div className={css.previewSection}>
            {videoPreview && (
              <div className={css.videoPreview}>
                <video src={videoPreview} controls className={css.videoPlayer} preload="metadata">
                  <FormattedMessage id="VideoUploadModal.videoNotSupported" />
                </video>
              </div>
            )}

            <div className={css.fileDetails}>
              <div className={css.detailRow}>
                <span className={css.detailLabel}>
                  <FormattedMessage id="VideoUploadModal.fileName" />
                </span>
                <span className={css.detailValue}>{selectedFile.name}</span>
              </div>

              <div className={css.detailRow}>
                <span className={css.detailLabel}>
                  <FormattedMessage id="VideoUploadModal.fileSize" />
                </span>
                <span className={css.detailValue}>{formatFileSize(selectedFile.size)}</span>
              </div>

              <div className={css.detailRow}>
                <span className={css.detailLabel}>
                  <FormattedMessage id="VideoUploadModal.fileType" />
                </span>
                <span className={css.detailValue}>{selectedFile.type}</span>
              </div>
            </div>

            {/* Upload Progress */}
            {loading && (
              <div className={css.progressContainer}>
                <div className={css.progressBar}>
                  <div className={css.progressFill} style={{ width: `${uploadProgress}%` }} />
                </div>
                <p className={css.progressText}>
                  {uploadStage === 'uploading' && `Uploading asset: ${uploadProgress}%`}
                  {uploadStage === 'processing' && `Processing asset: ${uploadProgress}%`}
                  {!uploadStage && `${uploadProgress}%`}
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className={css.errorContainer}>
                <p className={css.errorText}>{error}</p>
              </div>
            )}

            <div className={css.actionButtons}>
              <SecondaryButton onClick={handleReset} disabled={loading}>
                <FormattedMessage id="VideoUploadModal.reset" />
              </SecondaryButton>

              <PrimaryButton onClick={handleConfirmUpload} disabled={loading} inProgress={loading}>
                <FormattedMessage id="VideoUploadModal.confirmUpload" />
              </PrimaryButton>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default VideoUploadModal;
