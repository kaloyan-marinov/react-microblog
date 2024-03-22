import { useState, useEffect, useRef } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Body from "../components/Body";
import InputField from "../components/InputField";

export default function RegistrationPage() {
  const [formErrors, setFormErrors] = useState({});
  const usernameFieldRef = useRef();
  const emailFieldRef = useRef();
  const passwordFieldRef = useRef();
  const password2FieldRef = useRef();

  useEffect(() => {
    usernameFieldRef.current.focus();
  }, []);

  const onSubmit = async (event) => {
    // TODO
  };

  return (
    <Body>
      <h1>Register</h1>
      <Form onSubmit={onSubmit}>
        <InputField
          name="username"
          label="Username"
          error={formErrors.username}
          fieldRef={usernameFieldRef}
        />
        <InputField
          name="email"
          label="Email address"
          error={formErrors.email}
          fieldRef={emailFieldRef}
        />
        <InputField
          name="password"
          label="Password"
          type="password"
          error={formErrors.password}
          fieldRef={passwordFieldRef}
        />
        <InputField
          name="password2"
          label="Password again"
          type="password"
          error={formErrors.password2}
          fieldRef={password2FieldRef}
        />
        <Button variant="primary" type="submit">
          Register
        </Button>
      </Form>
    </Body>
  );
}
