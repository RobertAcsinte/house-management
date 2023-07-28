import { useAuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar/Navbar';
import { useState } from 'react';

function HomePage() {
  const context = useAuthContext();
  
  // const { currentUserDataDb } = context;
  let id = 0
  const [count, setCount] = useState(0)


  const call = () => {
    console.log(id)
    setCount(count + 1)
    id++
  }

  return (
    <>
      <Navbar showAllOptions/>
      {/* <div>{currentUserDataDb!.name}</div> */}
      <button onClick={call}>{count}</button>
    </>
  )
}

export default HomePage