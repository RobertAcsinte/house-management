import { useAuthContext } from '../../context/authContext';

function HomePage() {
  const context = useAuthContext();
  
  const { currentUser } = context;
  
  return (
    <div>{currentUser?.email}</div>
  )
}

export default HomePage