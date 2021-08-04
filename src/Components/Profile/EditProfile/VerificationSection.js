import React from 'react';
import VerifiedBadge from '../../UI/VerifiedBadge';
import { COOLDOWN_DAYS } from '../../../constants';

function VerificationForm({
  verificationReason,
  setVerificationReason,
  verificationIdPreview,
  hasIdFile,
  handleVerificationIdSelect,
  verificationFileRef,
  handleVerificationSubmit,
  submittingVerification,
  setVerificationIdFile,
  setVerificationIdPreview,
}) {
  return (
    <form className="epVerificationForm" onSubmit={handleVerificationSubmit}>
      <div className="epField">
        <label htmlFor="verification-reason" className="epLabel">Why should you be verified?</label>
        <textarea
          id="verification-reason"
          className="epInput epTextarea"
          value={verificationReason}
          onChange={(e) => setVerificationReason(e.target.value)}
          placeholder="e.g. I'm a registered business seller..."
          rows={3}
          required
        />
      </div>
      <div className="epField">
        <label htmlFor="verification-id-doc" className="epLabel">ID Document <span className="epLabelRequired">*</span></label>
        <p className="epHintMuted">Upload a government-issued ID or business registration.</p>
        {verificationIdPreview ? (
          <div className="epIdPreview">
            <img src={verificationIdPreview} alt="ID preview" />
            <button
              type="button"
              className="epIdPreviewRemove"
              onClick={() => {
                setVerificationIdFile(null);
                setVerificationIdPreview(null);
                if (verificationFileRef.current) verificationFileRef.current.value = '';
              }}
              aria-label="Remove ID image"
            >
              &#10005;
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="epUploadBtn epUploadBtnRequired"
            onClick={() => verificationFileRef.current && verificationFileRef.current.click()}
          >
            Upload ID document
          </button>
        )}
        <input
          id="verification-id-doc"
          ref={verificationFileRef}
          type="file"
          accept="image/*"
          onChange={handleVerificationIdSelect}
          className="epHiddenInput"
        />
      </div>
      <button
        type="submit"
        className="epBtn epBtnAccent epBtnLarge"
        disabled={submittingVerification || !hasIdFile}
        title={!hasIdFile ? 'Please upload an ID document first' : ''}
      >
        {submittingVerification ? 'Submitting...' : 'Request verification badge'}
      </button>
      {!hasIdFile && <p className="epHintError">Upload an ID document to enable submission.</p>}
    </form>
  );
}

export default function VerificationSection({
  isVerified,
  vStatus,
  vData,
  canReapply,
  cooldownActive,
  daysRemaining,
  submittingVerification,
  verificationReason,
  setVerificationReason,
  verificationIdPreview,
  verificationIdFile,
  handleVerificationIdSelect,
  verificationFileRef,
  handleVerificationSubmit,
  setVerificationIdFile,
  setVerificationIdPreview,
}) {
  if (isVerified || vStatus === 'approved') {
    return (
      <div className="verificationStatusCard verificationApproved">
        <VerifiedBadge size={24} />
        <div>
          <strong>Your account is verified</strong>
          <p>Buyers can see a verified badge on your profile and ads.</p>
          <p className="verificationPrivacyNote">Your ID document will be automatically deleted from our servers for your privacy and security.</p>
        </div>
      </div>
    );
  }
  if (vStatus === 'pending') {
    return (
      <div className="verificationStatusCard verificationPending">
        <span className="verificationStatusIcon">&#9203;</span>
        <div>
          <strong>Verification request pending</strong>
          <p>Your request is being reviewed. This usually takes 1-3 business days but may take up to {COOLDOWN_DAYS} days.</p>
          <p className="verificationSubmittedDate">
            Submitted: {vData?.createdAt
              ? new Date(vData.createdAt.seconds * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
              : 'Just now'}
          </p>
        </div>
      </div>
    );
  }
  if (vStatus === 'rejected') {
    return (
      <>
        <div className="verificationStatusCard verificationRejected">
          <span className="verificationStatusIcon verificationRejectedIcon">&#10005;</span>
          <div>
            <strong>Verification request was declined</strong>
            <p>
              Your previous request was not approved.
              {vData?.adminNote && <> Reason: <em>{vData.adminNote}</em></>}
              {canReapply ? ' You can submit a new request below.' : ` You can reapply in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}.`}
            </p>
          </div>
        </div>
        {cooldownActive && (
          <div className="verificationActions">
            <span className="verificationCooldownBadge">{daysRemaining}d remaining before you can reapply</span>
          </div>
        )}
        {canReapply && (
          <VerificationForm
            verificationReason={verificationReason}
            setVerificationReason={setVerificationReason}
            verificationIdPreview={verificationIdPreview}
            hasIdFile={!!verificationIdFile}
            handleVerificationIdSelect={handleVerificationIdSelect}
            verificationFileRef={verificationFileRef}
            handleVerificationSubmit={handleVerificationSubmit}
            submittingVerification={submittingVerification}
            setVerificationIdFile={setVerificationIdFile}
            setVerificationIdPreview={setVerificationIdPreview}
          />
        )}
      </>
    );
  }
  if (submittingVerification) {
    return (
      <div className="verificationStatusCard verificationPending">
        <span className="verificationStatusIcon">&#9203;</span>
        <div>
          <strong>Submitting your request...</strong>
          <p>Please wait while we process your verification request.</p>
        </div>
      </div>
    );
  }
  return (
    <>
      <p className="verificationDescription">Get a verified badge on your profile to build trust with buyers.</p>
      <VerificationForm
        verificationReason={verificationReason}
        setVerificationReason={setVerificationReason}
        verificationIdPreview={verificationIdPreview}
        hasIdFile={!!verificationIdFile}
        handleVerificationIdSelect={handleVerificationIdSelect}
        verificationFileRef={verificationFileRef}
        handleVerificationSubmit={handleVerificationSubmit}
        submittingVerification={submittingVerification}
        setVerificationIdFile={setVerificationIdFile}
        setVerificationIdPreview={setVerificationIdPreview}
      />
      <p className="verificationNote">Note: You can only submit one request every {COOLDOWN_DAYS} days.</p>
    </>
  );
}
