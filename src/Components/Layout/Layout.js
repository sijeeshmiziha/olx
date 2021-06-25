import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import MobileBottomNav from '../Navigation/MobileBottomNav';
import './Layout.css';

function Layout({ children, hideHeader, hideFooter, hideMobileNav }) {
  const classNames = [
    'appMain',
    hideHeader ? 'appMainNoHeader' : '',
    hideMobileNav ? 'appMainNoMobileNav' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      {!hideHeader && <Header />}
      <main className={classNames}>
        {children}
      </main>
      {!hideFooter && <Footer />}
      {!hideHeader && !hideMobileNav && <MobileBottomNav />}
    </>
  );
}

export default Layout;
