import { useAuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar/Navbar';

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