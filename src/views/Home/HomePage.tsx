import { useAuthContext } from '../../context/AuthContext';

function HomePage() {
  const context = useAuthContext();
  
  const { currentUser } = context;
  
  return (
    <div>{currentUser?.email}</div>
  )
}

export default HomePage