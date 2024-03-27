import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useApi } from "./ApiProvider";

const UserContext = createContext();

export default function UserProvider({ children }) {
  /*
  The `user` state variable is initialized with a value of `undefined`,
  which is used while the user is being retrieved from the server.
  (
  The state variable remains set to the initial `undefined` value
  until the user information has been returned,
  so any components that need to render user information
  can display a spinner or similar UI component while waiting.
  )
  
  The value will change to
  the user details returned by the server
  as soon as they have become available.
  
  The value will change to
  `null`
  if there is no authenticated user.
  */

  const [user, setUser] = useState();
  const api = useApi();

  useEffect(() => {
    (async () => {
      if (api.isAuthenticated()) {
        const response = await api.get("/me");
        setUser(response.ok ? response.body : null);
      } else {
        // Indicate to the rest of the frontend application that
        // there is no logged-in user.
        setUser(null);
      }
    })();
  }, [api]);

  const login = useCallback(
    async (username, password) => {
      const result = await api.login(username, password);

      if (result === "ok") {
        const response = await api.get("/me");
        setUser(response.ok ? response.body : null);
      }

      return result;
    },
    [api]
  );

  const logout = useCallback(async () => {
    await api.logout();

    // Indicate to the rest of the frontend application that
    // there is no logged-in user.
    setUser(null);
  }, [api]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
