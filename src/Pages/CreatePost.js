import React, { useContext } from 'react';
import Layout from '../Components/Layout/Layout';
import Create from '../Components/Create/Create';
import { AuthContext } from '../contextStore/AuthContext';

const CreatePage = () => {
  const { user } = useContext(AuthContext);

  return <Layout>{user ? <Create /> : null}</Layout>;
};

export default CreatePage;
