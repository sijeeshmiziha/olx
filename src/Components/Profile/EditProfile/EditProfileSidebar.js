import React from 'react';
import VerifiedBadge from '../../UI/VerifiedBadge';
import LinkedAccounts from '../LinkedAccounts';

export default function EditProfileSidebar({
  user,
  phone,
  profileState,
  profileCity,
  companyName,
  languages,
  verificationContent,
}) {
  return (
    <div className="epSidebar">
      <div className="epCard epCardVerification">
        <h2 className="epCardTitle">
          <VerifiedBadge size={20} />
          Verification badge
        </h2>
        {verificationContent}
      </div>
      <div className="epCard epCardInfo">
        <h3 className="epCardSubtitle">Account info</h3>
        <div className="epInfoRow">
          <span className="epInfoLabel">Email</span>
          <span className="epInfoValue">{user?.email || '—'}</span>
        </div>
        <div className="epInfoRow">
          <span className="epInfoLabel">Phone</span>
          <span className="epInfoValue">{phone || '—'}</span>
        </div>
        <div className="epInfoRow">
          <span className="epInfoLabel">Location</span>
          <span className="epInfoValue">
            {profileCity && profileState ? `${profileCity}, ${profileState}` : profileState || '—'}
          </span>
        </div>
        {companyName && (
          <div className="epInfoRow">
            <span className="epInfoLabel">Business</span>
            <span className="epInfoValue">{companyName}</span>
          </div>
        )}
        {languages && (
          <div className="epInfoRow">
            <span className="epInfoLabel">Languages</span>
            <span className="epInfoValue">{languages}</span>
          </div>
        )}
        <div className="epInfoRow">
          <span className="epInfoLabel">Member since</span>
          <span className="epInfoValue">
            {user?.metadata?.creationTime
              ? new Date(user.metadata.creationTime).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
              : '—'}
          </span>
        </div>
        <div className="epInfoRow">
          <span className="epInfoLabel">User ID</span>
          <span className="epInfoValue epInfoMono">{user?.uid ? user.uid.slice(0, 12) + '...' : '—'}</span>
        </div>
      </div>
      <div className="epCard">
        <LinkedAccounts />
      </div>
    </div>
  );
}
