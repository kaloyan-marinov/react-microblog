import { useLocation, Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserProvider";

export default function PrivateRoute({ children }) {
  const { user } = useUser();
  const location = useLocation();

  if (user === undefined) {
    // The frontend application isn't ready to provide/disclose user information yet,
    // so cause this component to render nothing.
    return null;
  } else if (user) {
    // There is an authenticated user.
    return children;
  } else {
    // `user` is `null`, indicating that the user is not authenticated.
    // Redirect the user to the login page,
    // and once the user submits the authentication form,
    // redirect them back to the private route that they initially attempted to access.
    const url = location.pathname + location.search + location.hash;
    return <Navigate to="/login" state={{ next: url }} />;
  }
}
