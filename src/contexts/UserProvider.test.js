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

test("logs user in with bad credentials", async () => {
  const urls = [];

  global.fetch.mockImplementationOnce((url) => {
    urls.push(url);

    return {
      status: 401,
      ok: false,
      json: () => Promise.resolve({}),
    };
  });

  const Test = () => {
    const [result, setResult] = useState();
    const { login, user } = useUser();

    useEffect(() => {
      (async () => {
        setResult(await login("username", "password"));
      })();
    }, []);
    return <>{result}</>;
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

  const element = await screen.findByText("fail");
  expect(element).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(urls).toHaveLength(1);
  expect(urls[0]).toMatch(/^http.*\/api\/tokens$/);
});

test("logs user out", async () => {
  // Instead of repeating a login procedure as in previous tests,
  // this test installs a fake access token in local storage,
  // which will make the frontend application believe that
  // it is being started within a browser which some user has already logged in on.
  localStorage.setItem("accessToken", "MOCKED-123");

  global.fetch
    .mockImplementationOnce((url) => {
      return {
        status: 200,
        ok: true,
        json: () =>
          Promise.resolve({
            username: "susan",
          }),
      };
    })
    .mockImplementationOnce((url) => {
      return {
        status: 204,
        ok: true,
        json: () => Promise.resolve({}),
      };
    });

  const Test = () => {
    const { user, logout } = useUser();

    if (user) {
      return (
        <>
          <p>{user.username}</p>
          <button onClick={logout}>logout</button>
        </>
      );
    } else if (user === null) {
      return <p>logged out</p>;
    } else {
      return null;
    }
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

  const element = await screen.findByText("susan");
  const button = await screen.findByRole("button");
  expect(element).toBeInTheDocument();
  expect(button).toBeInTheDocument();

  // Simulate a user clicking the button for logging out,
  // by utizing the `user-event`,
  // which is included in the React Testing Library
  // and is a companion library that is specialized in generating fake events.
  userEvent.click(button);
  const element2 = await screen.findByText("logged out");
  expect(element2).toBeInTheDocument();
  expect(localStorage.getItem("accessToken")).toBeNull();
});
