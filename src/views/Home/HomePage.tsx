import { useAuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar/Navbar';

function HomePage() {
  const context = useAuthContext();
  
  const { currentUserDataDb } = context;

  return (
    <>
      <Navbar userName={currentUserDataDb?.name}/>
      <div>{currentUserDataDb?.email}</div>
    </>
  )
}

export default HomePage