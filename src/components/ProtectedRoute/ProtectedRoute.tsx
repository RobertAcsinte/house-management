import { Navigate } from "react-router-dom"
import { useAuthContext } from "../../context/AuthContext"


export type ProtectedRouteProps = {
  redirectPathAuthCondition: string
  redirectPathHouseCondition: string
  requiresLoggedIn: boolean
  requiresHouseJoined: boolean
  isAccount: boolean
  component: JSX.Element
};

function ProtectedRoute({ redirectPathAuthCondition, redirectPathHouseCondition, requiresLoggedIn, requiresHouseJoined, isAccount, component}: ProtectedRouteProps) {
  const context = useAuthContext()

  if(requiresLoggedIn) {
    if(isAccount) {
      return context.currentUser ? component : <Navigate to={{ pathname: redirectPathAuthCondition }} /> 
    }
    if(requiresHouseJoined) {
      return context.currentUser ? (context.currentUserDataDb?.houseId ? component: <Navigate to={{ pathname: redirectPathHouseCondition}} />)
      : <Navigate to={{ pathname: redirectPathAuthCondition }} />
    }
    else {
      return context.currentUser ? (!context.currentUserDataDb?.houseId ? component: <Navigate to={{ pathname: redirectPathHouseCondition}} />)
      : <Navigate to={{ pathname: redirectPathAuthCondition }} />
    }
  }
  else {
    return !context.currentUser ? component : <Navigate to={{ pathname: redirectPathAuthCondition }} /> 
  }

}

export default ProtectedRoute