import { Navigate } from "react-router-dom"
import { useAuthContext } from "../../context/AuthContext"


export type ProtectedRouteProps = {
  authenticationPath: string
  requiresLoggedIn: boolean
  component: JSX.Element
};

function ProtectedRoute({ authenticationPath, requiresLoggedIn, component}: ProtectedRouteProps) {
  const { currentUser } = useAuthContext()

  if(requiresLoggedIn) {
    return currentUser ? component : <Navigate to={{ pathname: authenticationPath }} />
  }
  else {
    return !currentUser ? component : <Navigate to={{ pathname: authenticationPath }} /> 
  }

}

export default ProtectedRoute