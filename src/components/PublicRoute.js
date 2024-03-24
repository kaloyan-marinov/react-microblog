import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserProvider";

export default function PublicRoute({ children }) {
  /*
  This component only allows its children to render when the user is not logged in,
  or else it redirects the user to the root URL of the application.

  Motivation:
  this component can and should be used
  to prevent a logged-in user from navigating to any routes
  that are rendered purposeless as soon as the user has logged in.
  */

  const { user } = useUser();

  if (user === undefined) {
    return null;
  } else if (user) {
    return <Navigate to="/" />;
  } else {
    return children;
  }
}
