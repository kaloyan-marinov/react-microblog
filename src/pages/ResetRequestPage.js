import { useState, useEffect, useRef } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Body from "../components/Body";
import InputField from "../components/InputField";
import { useApi } from "../contexts/ApiProvider";
import { useFlash } from "../contexts/FlashProvider";

export default function ResetRequestPage() {
  const [formErrors, setFormErrors] = useState({});
  const emailFieldRef = useRef();
  const api = useApi();
  const flash = useFlash();

  useEffect(() => {
    emailFieldRef.current.focus();
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    const response = await api.post("/tokens/reset", {
      email: emailFieldRef.current.value,
    });

    if (!response.ok) {
      setFormErrors(response.body.errors.json);
    } else {
      emailFieldRef.current.value = "";
      setFormErrors({});
      flash(
        "You will receive an email with instructions to reset your password",
        "info"
      );
    }
  };

  return (
    <Body>
      <h1>Reset Your Password</h1>
      <Form onSubmit={onSubmit}>
        <InputField
          name="email"
          label="Email Address"
          error={formErrors.email}
          fieldRef={emailFieldRef}
        />
        <Button variant="primary" type="submit">
          Reset Password
        </Button>
      </Form>
    </Body>
  );
}
