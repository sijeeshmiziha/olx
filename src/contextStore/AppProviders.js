import React from 'react';
import ContextAllPost from './AllPostContext';
import ContextPost from './PostContext';
import ContextLocation from './LocationContext';
import NotificationProvider from './NotificationContext';
import OfferProvider from './OfferContext';
import WatchlistProvider from './WatchlistContext';
import ContextChat from './ChatContext';
import { ToastProvider } from './ToastContext';

function AppProviders({ children }) {
  return (
    <NotificationProvider>
      <OfferProvider>
        <WatchlistProvider>
          <ContextChat>
            <ContextAllPost>
              <ContextPost>
                <ContextLocation>
                  <ToastProvider>{children}</ToastProvider>
                </ContextLocation>
              </ContextPost>
            </ContextAllPost>
          </ContextChat>
        </WatchlistProvider>
      </OfferProvider>
    </NotificationProvider>
  );
}

export default AppProviders;
