import React from 'react';
import Layout from '../Components/Layout/Layout';
import EmailLinkSignIn from '../Components/Auth/EmailLinkSignIn';

function EmailLinkLoginPage() {
  return (
    <Layout hideHeader hideFooter>
      <EmailLinkSignIn />
    </Layout>
  );
}

export default EmailLinkLoginPage;
