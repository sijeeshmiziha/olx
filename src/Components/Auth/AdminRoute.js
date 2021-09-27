import React, { useContext, useState, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../../contextStore/AuthContext';
import { getUserRef } from '../../firebase/collections';

function AdminRoute({ children, ...rest }) {
  const { user, authLoading } = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkDone, setCheckDone] = useState(false);

  useEffect(() => {
    if (!user?.uid) {
      setCheckDone(true);
      setIsAdmin(false);
      return;
    }
    getUserRef(user.uid)
      .get()
      .then((doc) => {
        setIsAdmin(doc.exists && doc.data().role === 'admin');
        setCheckDone(true);
      })
      .catch(() => {
        setIsAdmin(false);
        setCheckDone(true);
      });
  }, [user?.uid]);

  if (authLoading || !checkDone) return null;

  return (
    <Route
      {...rest}
      render={({ location }) =>
        user && isAdmin ? (
          children
        ) : user ? (
          <Redirect to={{ pathname: '/', state: { from: location } }} />
        ) : (
          <Redirect
            to={{ pathname: '/login', state: { from: location } }}
          />
        )
      }
    />
  );
}

export default AdminRoute;
