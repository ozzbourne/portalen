import React from 'react';
import { LogoutBtn } from './styledComponents/GlobalStyles'
import { SmallPageWrapper } from './styledComponents/SmallPageStyles'




const NotYourAccount = (props) => (
  <SmallPageWrapper>
      <p>Denna app tillhör inte dig!</p>
      <LogoutBtn onClick={() => props.logout()}>LogOut</LogoutBtn>
  </SmallPageWrapper>
  
);



export default NotYourAccount;