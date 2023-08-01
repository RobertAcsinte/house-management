import { useAuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar/Navbar';
import { useState } from 'react';

function HomePage() {
  const context = useAuthContext();
  
  const { currentUserDataDb } = context;

  return (
    <>
      <Navbar showAllOptions/>
      <div>{currentUserDataDb!.name}</div>
    </>
  )
}

export default HomePage