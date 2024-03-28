import { render, screen, act } from "@testing-library/react";
import { useEffect } from "react";
import FlashProvider from "./FlashProvider";
import { useFlash } from "./FlashProvider";
import FlashMessage from "../components/FlashMessage";

// Since the flashing mechanisms in the application use timers,
// it is a good idea to use mocked/simulated timers that can run time faster.
beforeEach(() => {
  // Switch to mocked/simulated timers.
  jest.useFakeTimers();
});

afterEach(() => {
  // Switch (back) to the default timers from JavaScript.
  jest.useRealTimers();
});

test("flashes a message", async () => {
  const ComponentThatLaunchesASideEffectFnWithoutRenderingAnything = () => {
    const flash = useFlash();

    useEffect(() => {
      flash("[mocked] this alert contains critical information!", "danger");
    }, []);

    return null;
  };

  // This test works with a situation
  // that is similar to the one in `src/components/Post.test.js`.
  // Namely, since the `ComponentThatLaunchesASideEffectFnWithoutRenderingAnything`
  // invokes the `flash` function,
  // it is necessary to have the support of the `FlashContext`.
  // So instead of rendering the ComponentThatLaunchesASideEffectFnWithoutRenderingAnything` alone,
  // it is wrapped in a `FlashProvider` component.
  render(
    <FlashProvider>
      <FlashMessage />
      <ComponentThatLaunchesASideEffectFnWithoutRenderingAnything />
    </FlashProvider>
  );

  // An important implementation detail of the `render()` function is that
  // it not only renders the component tree,
  // but also waits for side effects functions to run and update the application state
  // until the application settles and there is nothing else to update.
  //
  // When `render()` returns, the alert should already be visible.
  const alert = screen.getByRole("alert");

  expect(alert).toHaveTextContent(
    "[mocked] this alert contains critical information!"
  );
  expect(alert).toHaveClass("alert-danger");
  expect(alert).toHaveAttribute("data-visible", "true");

  // The `act()` function, which is provided by the React Testing Library, will
  // call the function passed as an argument
  // (
  // which might change some state variables that will require some re-renders
  // and that in turn might launch new side effect functions that might require even more re-renders
  // )
  // and then wait for the React application to settle down.
  //
  // In essence, the `act()` function is designed
  // to wait for such asynchronous activity to complete
  // (i.e. for all state variables, side effects, and re-renders to settle).
  //
  // It is important to emphasize that
  // calling `jest.runAllTimers()` directly does not perform the above-mentioned "safety wait".
  // To wit:
  //    if the next statement is replaced with a direct call to `jest.runAllTimers()`,
  //    running this test in a terminal session would FAIL
  //    and the following would be displayed in the terminal session:
  //    ```
  //    console.error
  //    Warning: An update to Transition inside a test was not wrapped in act(...).
  //
  //    When testing, code that causes React state updates should be wrapped into act(...):
  //
  //    # ...
  //
  //    console.error
  //    Warning: An update to FlashProvider inside a test was not wrapped in act(...).
  //    ```

  // When testing, code that causes React state updates should be wrapped into act(...):
  act(() => {
    // Advance [Jest's simulation or hijacked-version or mocked substitute of] the time
    // until (the moment when) the next timer fires.
    jest.runAllTimers();
  });
  expect(alert).toHaveAttribute("data-visible", "false");
});
