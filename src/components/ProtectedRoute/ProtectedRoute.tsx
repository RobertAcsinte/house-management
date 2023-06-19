import { Navigate } from "react-router-dom"
import { useAuthContext } from "../../context/AuthContext"


export type ProtectedRouteProps = {
  redirectPath: string
  requiresLoggedIn: boolean
  requiresHouseJoined: boolean
  component: JSX.Element
};

function ProtectedRoute({ redirectPath, requiresLoggedIn, requiresHouseJoined, component}: ProtectedRouteProps) {
  const context = useAuthContext()

  if(requiresLoggedIn) {
    if(requiresHouseJoined) {
      return context.currentUser ? (context.currentUserDataDb?.houseId ? component: <Navigate to={{ pathname: '/no_house' }} />)
      : <Navigate to={{ pathname: redirectPath }} />
    }
    else {
      return context.currentUser ? (!context.currentUserDataDb?.houseId ? component: <Navigate to={{ pathname: '/' }} />)
      : <Navigate to={{ pathname: redirectPath }} />
    }
  }
  else {
    return !context.currentUser ? component : <Navigate to={{ pathname: redirectPath }} /> 
  }

}

export default ProtectedRoute