import React   from 'react';
import Header from '../Header/Header';

const App = ({ children }) => (
  <div>
    <Header />

    <main>
      {children}
    </main>

  </div>
);

export default App;

