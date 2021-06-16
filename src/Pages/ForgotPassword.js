import React from 'react';
import Layout from '../Components/Layout/Layout';
import ForgotPassword from '../Components/Auth/ForgotPassword';

function ForgotPasswordPage() {
  return (
    <Layout hideHeader hideFooter>
      <ForgotPassword />
    </Layout>
  );
}

export default ForgotPasswordPage;
