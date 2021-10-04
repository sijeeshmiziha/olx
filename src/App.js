import React from 'react';
import './App.css';
import ContextAuth from './contextStore/AuthContext';
import ContextPost from './contextStore/PostContext';
import MainRoutes from './MainRoutes/MainRoutes';

function App(){
  return (
    <div>
      <ContextAuth>
        <ContextPost>
          <MainRoutes/> 
        </ContextPost> 
      </ContextAuth> 
    </div>
  );
}

export default App;
