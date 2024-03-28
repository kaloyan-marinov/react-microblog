import { render, screen } from "@testing-library/react";
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
});
