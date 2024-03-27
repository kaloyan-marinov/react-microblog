import { createContext, useContext, useState, useCallback } from "react";

export const FlashContext = createContext();

// You may wonder why this variable is declared as a global variable
// and not a state variable inside the component.
// State variables have the unique feature
// that they cause any components that use them to re-render when they change.
// The timer used by this component is an internal implementation value
// [in the sense that it] has no bearing on
// anything that is visible on the page that might need to re-render,
// so for that reason a global variable is used.
let flashTimer;

export default function FlashProvider({ children }) {
  const [flashMessage, setFlashMessage] = useState({});
  const [visible, setVisible] = useState(false);

  const hideFlash = useCallback(() => {
    setVisible(false);
  }, []);

  const flash = useCallback(
    (message, type, duration = 10) => {
      if (flashTimer) {
        // There is currently an alert on display.
        // To replace it, cancel its associated timer
        // (which would allow a new timer to be created for the new alert).
        clearTimeout(flashTimer);
        flashTimer = undefined;
      }

      // Create a new alert.
      setFlashMessage({
        message,
        type,
      });
      setVisible(true);
      if (duration) {
        flashTimer = setTimeout(hideFlash, duration * 1000);
      }
    },
    [hideFlash]
  );

  return (
    <FlashContext.Provider
      value={{
        flash,
        hideFlash,
        flashMessage,
        visible,
      }}
    >
      {children}
    </FlashContext.Provider>
  );
}

export function useFlash() {
  return useContext(FlashContext).flash;
}
