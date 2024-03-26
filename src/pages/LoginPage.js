import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Body from "../components/Body";
import InputField from "../components/InputField";
import { useUser } from "../contexts/UserProvider";
import { useFlash } from "../contexts/FlashProvider";

export default function LoginPage() {
  const [formErrors, setFormErrors] = useState({});
  const usernameFieldRef = useRef();
  const passwordFieldRef = useRef();
  const { login } = useUser();
  const flash = useFlash();
  // The following is similar to the `<Navigate>` component, but in function form.
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    usernameFieldRef.current.focus();
  }, []);

  const onSubmit = async (ev) => {
    // Very Important:
    // Disable the browser's own form-submission logic,
    // in order to prevent the browser
    // from sending a network request with the form data.
    ev.preventDefault();

    const username = usernameFieldRef.current.value;
    const password = passwordFieldRef.current.value;

    const errors = {};
    if (!username) {
      errors.username = "Username must not be empty.";
    }
    if (!password) {
      errors.password = "Password must not be empty.";
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    // Perform the authentication procedure.
    const result = await login(username, password);
    if (result === "fail") {
      // The authentication request failed because of invalid credentials.
      flash("Invalid username or passsword", "danger");
    } else if (result === "ok") {
      // The user is successfully authenticated.
      // (The API client now has an access token
      // and the user context has the user details to share with other components,
      // so the user can be redirected to any of the private routes of the application.)
      let next = "/";
      if (location.state && location.state.next) {
        next = location.state.next;
      }
      navigate(next);
    } else {
      // In this case, `request === "error"`,
      // i.e. the authentication request failed not because of invalid credentials
      // but because of an unexpected issue.
      console.log(
        "TODO: this will be handled later with an application-wide error handler"
      );
    }
  };

  return (
    <Body>
      <h1>Login</h1>
      <Form onSubmit={onSubmit}>
        <InputField
          name="username"
          label="Username or email address"
          error={formErrors.username}
          fieldRef={usernameFieldRef}
        />
        <InputField
          name="password"
          label="Password"
          type="password"
          error={formErrors.password}
          fieldRef={passwordFieldRef}
        />
        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
      <hr />
      <p>
        Forgot your password? You can <Link to="/reset-request">reset it</Link>.
      </p>
      <p>
        Don&apos;t have an account? <Link to="/register">Register here</Link>!
      </p>
    </Body>
  );
}
