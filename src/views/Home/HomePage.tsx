import { useAuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar/Navbar';

function HomePage() {
  const context = useAuthContext();
  
  const { currentUser } = context;
  
  console.log(currentUser)

  return (
    <>
      <Navbar userName={currentUser!!.displayName}/>
      <div>{currentUser?.email}</div>
    </>
  )
}

export default HomePage