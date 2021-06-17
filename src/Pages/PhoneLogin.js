import React from 'react';
import Layout from '../Components/Layout/Layout';
import PhoneSignIn from '../Components/Auth/PhoneSignIn';

function PhoneLoginPage() {
  return (
    <Layout hideHeader hideFooter>
      <PhoneSignIn />
    </Layout>
  );
}

export default PhoneLoginPage;
