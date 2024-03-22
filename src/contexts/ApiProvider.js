import { createContext, useContext } from "react";
import MicroblogApiClient from "../MicroblogApiClient";

// At first thought, one may consider
// incorporating the `MicroblogApiClient` class into the frontend application
// by creating an instance of the class in each component that needs API access.
// The problem with this approach is that
// it is inefficient when many components need to issue requests to the backend API.
//
// A better solution is to create a single instance
// that is shared among all the components that need to use the API.
// Recall that components can share data by passing props,
// but doing this would require the API client instance to be passed
// from high-level components
// down to low-level components
// through all the levels in between.
// (This problem/inconvenience has been termed "prop drilling.")
//
// For cases when something needs to be shared with many components
// that are located at different levels of the [component] tree,
// React provides _contexts_.
const ApiContext = createContext();

export default function ApiProvider({ children }) {
  const api = new MicroblogApiClient();

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
}

export function useApi() {
  return useContext(ApiContext);
}
