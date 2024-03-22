import { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Body from "../components/Body";
import InputField from "../components/InputField";

export default function LoginPage() {
  const [formErrors, setFormErrors] = useState({});

  const onSubmit = (ev) => {
    // Very Important:
    // Disable the browser's own form-submission logic,
    // in order to prevent the browser
    // from sending a network request with the form data.
    ev.preventDefault();

    console.log("handle form-submission here");
  };

  return (
    <Body>
      <h1>Login</h1>
      <Form onSubmit={onSubmit}>
        <InputField
          name="username"
          label="Username or email address"
          error={formErrors.username}
        />
        <InputField
          name="password"
          label="Password"
          type="password"
          error={formErrors.password}
        />
        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
    </Body>
  );
}
