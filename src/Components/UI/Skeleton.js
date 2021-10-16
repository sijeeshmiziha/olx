import React from 'react';
import './Skeleton.css';

function Skeleton({ width, height, className }) {
  return (
    <div
      className={`skeleton ${className || ''}`}
      style={{ width: width || '100%', height: height || '1em' }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="cardSkeleton">
      <div className="cardSkeletonImageWrap">
        <div className="cardSkeletonImage">
          <span className="skeleton" />
        </div>
        <Skeleton className="cardSkeletonFavorite" />
      </div>
      <div className="cardSkeletonContent">
        <Skeleton height={20} width="45%" className="cardSkeletonPrice" />
        <Skeleton height={14} width="95%" className="cardSkeletonTitle" />
        <Skeleton height={14} width="75%" className="cardSkeletonTitle" />
        <div className="cardSkeletonMeta">
          <Skeleton height={12} width="50%" className="cardSkeletonMetaItem" />
          <Skeleton height={12} width="35%" className="cardSkeletonMetaItem" />
        </div>
      </div>
    </div>
  );
}

function ChatListSkeletonItem() {
  return (
    <div className="chatListSkeletonItem">
      <Skeleton className="chatListSkeletonAvatar" />
      <div className="chatListSkeletonBody">
        <Skeleton height={14} width="60%" className="chatListSkeletonName" />
        <Skeleton height={12} width="85%" className="chatListSkeletonPreview" />
      </div>
      <Skeleton height={12} width={36} className="chatListSkeletonTime" />
    </div>
  );
}

export function ChatListSkeleton({ count = 5 }) {
  return (
    <>
      <div className="messagesSidebarHeader">Messages</div>
      <ul className="chatList chatListSkeleton">
        {Array.from({ length: count }, (_, i) => (
          <li key={i}>
            <ChatListSkeletonItem />
          </li>
        ))}
      </ul>
    </>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="profilePage profileSkeleton">
      <div className="profileSkeletonHeader">
        <Skeleton className="profileSkeletonAvatar" />
        <Skeleton height={24} width={160} className="profileSkeletonName" />
        <div className="profileSkeletonStats">
          <Skeleton height={16} width={60} />
          <Skeleton height={16} width={60} />
        </div>
      </div>
      <div className="profileSkeletonBody">
        <Skeleton height={16} width="100%" />
        <Skeleton height={16} width="80%" />
        <Skeleton height={16} width="60%" />
      </div>
    </div>
  );
}

export function NotificationSkeleton({ count = 4 }) {
  return (
    <ul className="notificationList notificationListSkeleton">
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className="notificationListSkeletonItem">
          <Skeleton className="notificationListSkeletonIcon" />
          <div className="notificationListSkeletonContent">
            <Skeleton height={14} width="70%" />
            <Skeleton height={12} width="90%" />
            <Skeleton height={10} width={80} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function ListRowSkeleton() {
  return (
    <div className="listRowSkeleton">
      <Skeleton className="listRowSkeletonImage" />
      <div className="listRowSkeletonBody">
        <Skeleton height={18} width="50%" />
        <Skeleton height={14} width="80%" />
        <Skeleton height={12} width="40%" />
      </div>
    </div>
  );
}

export function LinesSkeleton({ count = 4 }) {
  return (
    <div className="linesSkeleton">
      {Array.from({ length: count }, (_, i) => (
        <Skeleton
          key={i}
          height={16}
          width={i === count - 1 ? '60%' : '100%'}
        />
      ))}
    </div>
  );
}

export default Skeleton;
