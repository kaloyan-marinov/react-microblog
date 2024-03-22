import { useState, useEffect, useRef } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Body from "../components/Body";
import InputField from "../components/InputField";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [formErrors, setFormErrors] = useState({});
  const usernameFieldRef = useRef();
  const passwordFieldRef = useRef();

  useEffect(() => {
    usernameFieldRef.current.focus();
  }, []);

  const onSubmit = (ev) => {
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

    // TODO: log the user in
    console.log(`You entered ${username}:${password}`);
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
        Don&apos;t have an account? <Link to="/register">Register here</Link>!
      </p>
    </Body>
  );
}
