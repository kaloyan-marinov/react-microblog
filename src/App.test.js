import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  // Rendering in this case does not happen in the browser,
  // but in an emulated environment that is similar to the browser.
  render(<App />);

  // Query the contents of the page that was rendered by the preceding statement.
  const element = screen.getByText(/Microblog/i);

  expect(element).toBeInTheDocument();
  expect(element).toHaveClass("navbar-brand");
});
