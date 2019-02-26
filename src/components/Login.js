import React from 'react';
import { SmallPageWrapper } from './styledComponents/SmallPageStyles'

// TODO: proptypes

const Login = (props) => (
  <SmallPageWrapper>
    <nav className="login">
      <p>För att komma åt din app måste du logga in först.</p>
      <button className="facebook" onClick={() => props.authenticate('Facebook')}>Logga in med Facebook</button>
    </nav>
  </SmallPageWrapper>
);



export default Login;