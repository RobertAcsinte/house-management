import { useAuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar/Navbar';

function NoHouse() {
  const context = useAuthContext();
  
  const { currentUserDataDb } = context;

  return (
    <>
      <Navbar showAllOptions = {false}/>
      <div>{currentUserDataDb!.name}</div>
    </>
  )
}

export default NoHouse