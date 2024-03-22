import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Body from "../components/Body";
import InputField from "../components/InputField";
import { useApi } from "../contexts/ApiProvider";
import { useFlash } from "../contexts/FlashProvider";

export default function RegistrationPage() {
  const [formErrors, setFormErrors] = useState({});
  const usernameFieldRef = useRef();
  const emailFieldRef = useRef();
  const passwordFieldRef = useRef();
  const password2FieldRef = useRef();
  const navigate = useNavigate();
  const api = useApi();
  const flash = useFlash();

  useEffect(() => {
    usernameFieldRef.current.focus();
  }, []);

  const onSubmit = async (event) => {
    // Very important:
    // Disable the browser's own form-submission logic,
    // in order to prevent the browser
    // from sending a network request with the form data.
    event.preventDefault();

    if (passwordFieldRef.current.value !== password2FieldRef.current.value) {
      setFormErrors({
        password2: "Passwords don't match",
      });
    } else {
      const response = await api.post("/users", {
        username: usernameFieldRef.current.value,
        email: emailFieldRef.current.value,
        password: passwordFieldRef.current.value,
      });

      if (!response.ok) {
        console.log(response.body.errors.json);
        setFormErrors(response.body.errors.json);
      } else {
        setFormErrors({});
        flash("You have successfully registered!", "success");
        navigate("/login");
      }
    }
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
