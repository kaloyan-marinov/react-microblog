import { createContext, useContext } from "react";
import MicroblogApiClient from "../MicroblogApiClient";
import { useFlash } from "./FlashProvider";

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
  const flash = useFlash();

  const onError = () => {
    // The following statement causes React to re-render the `FlashProvider`,
    // which will create a new `flash` function,
    // which will in turn cause React to re-render the current component,
    // creating a new `onError` and a new instance of the `MicroblogApiClient` class.
    // That causes any component
    //    which calls the `useApi` hook
    //    and has a side effect function depending on the instance returned by the hook
    // to be re-rendered by React;
    // one such component is the `UserProvider`.
    // All that risks entering an endless render loop/cycle,
    // which _at first sight_ is launched
    // due to cyclical/circular chain of dependencies (among components).
    flash("An unexpected error has occurred. Please try again.", "danger");
  };

  const api = new MicroblogApiClient(onError);

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
}

export function useApi() {
  return useContext(ApiContext);
}
