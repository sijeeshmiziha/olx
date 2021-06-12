import React from 'react';
import Layout from '../Components/Layout/Layout';
import Login from '../Components/Login/Login';

function LoginPage() {
  return (
    <Layout hideHeader hideFooter>
      <Login />
    </Layout>
  );
}

export default LoginPage;
