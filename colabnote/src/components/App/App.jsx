import React, { Component } from 'react';
import Home from '../Home/Home'
import Header from '../Header/Header';
import { withRouter } from 'react-router-dom';

const App = ({ children }) => (
  <div>
    <Header />

    <main>
      {children}
    </main>

  </div>
);

export default App;

