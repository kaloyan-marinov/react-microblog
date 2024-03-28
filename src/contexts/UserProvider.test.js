import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState, useEffect } from "react";
import FlashProvider from "./FlashProvider";
import ApiProvider from "./ApiProvider";
import UserProvider from "./UserProvider";
import { useUser } from "./UserProvider";

// Your tests should run in complete isolation,
// without requiring the availability of external services
// such as databases or API back ends.
//
// When a component that makes calls to a back end needs to be tested,
// any API calls that it makes should be mocked.
//
// Since the purpose of mocking is
// to prevent network access from actually reaching a remote server,
// the `fetch()` function (from JavaScript) is the target to mock.
//
// (
// Accessing the `fetch()` function as `global.fetch` is done
// to make the intention of mocking a global function more clear.
// )
const realFetch = global.fetch;

beforeEach(() => {
  // Functions created with `jest.fn()` have the interesting properties that
  // (a) they record calls made to them,
  //     so these calls can then be checked in test assertions, and
  // (b) Jest mocks can be programmed to return specific values, as needed by each test.
  global.fetch = jest.fn();
});

afterEach(() => {
  global.fetch = realFetch;
  // Since the `MicroblogApiClient` class stores access tokens in local storage,
  // it is also a good practice to clear any data the might have been stored during a test
  // when the test is done.
  localStorage.clear();
});

test("logs user in", async () => {
  const urls = [];

  global.fetch
    .mockImplementationOnce((url) => {
      urls.push(url);

      return {
        status: 200,
        ok: true,
        json: () =>
          Promise.resolve({
            access_token: "MOCKED-123",
          }),
      };
    })
    .mockImplementationOnce((url) => {
      urls.push(url);

      return {
        status: 200,
        ok: true,
        json: () =>
          Promise.resolve({
            username: "MOCKED-susan",
          }),
      };
    });

  const Test = () => {
    const { login, user } = useUser();

    useEffect(() => {
      (async () => await login("MOCKED-username", "MOCKED-password"))();
    }, []);

    return user ? <p>{user.username}</p> : null;
  };

  render(
    <FlashProvider>
      <ApiProvider>
        <UserProvider>
          <Test />
        </UserProvider>
      </ApiProvider>
    </FlashProvider>
  );

  const element = await screen.findByText("MOCKED-susan");
  expect(element).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(2);
  expect(urls).toHaveLength(2);
  // The next assertions are based on regular expressions,
  // in order to avoid discrepancies in the domain and port portions of the URL
  // (both of which are irrelevant to this test).
  expect(urls[0]).toMatch(/^http.*\/api\/tokens$/);
  expect(urls[1]).toMatch(/^http.*\/api\/me$/);
});
