import React from 'react';

import { Link } from 'react-router-dom';

const Header = () => (
  <div className="jumbotron" style={{ paddingTop:'1rem', paddingBottom:'1rem', marginBottom:'0'}}>
    {/* <Link to="/">Home</Link> */}
    <h1 style={{textAlign:'center', color:'#393e46'}}>ColabNote</h1>
  </div>
);

export default Header;