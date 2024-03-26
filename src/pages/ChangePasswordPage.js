import { useState, useEffect, useRef } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import Body from "../components/Body";
import InputField from "../components/InputField";
import { useApi } from "../contexts/ApiProvider";
import { useFlash } from "../contexts/FlashProvider";

export default function ChnagePasswordPage() {
  const [formErrors, setFormErrors] = useState({});
  const oldPasswordFieldRef = useRef();
  const passwordFieldRef = useRef();
  const password2FieldRef = useRef();
  const navigate = useNavigate();
  const api = useApi();
  const flash = useFlash();

  useEffect(() => {
    oldPasswordFieldRef.current.focus();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();

    if (passwordFieldRef.current.value !== password2FieldRef.current.value) {
      setFormErrors({
        password2: "New passwords don't match",
      });
    } else {
      const response = await api.put("/me", {
        old_password: oldPasswordFieldRef.current.value,
        password: passwordFieldRef.current.value,
      });

      if (response.ok) {
        setFormErrors({});
        flash("Your password has been updated", "success");
        navigate("/me");
      } else {
        setFormErrors(response.body.errors.json);
      }
    }
  };

  return (
    <Body sidebar>
      <h1>Change Your Password</h1>
      <Form onSubmit={onSubmit}>
        <InputField
          name="oldPassword"
          label="Old Password"
          type="password"
          error={formErrors.old_password}
          fieldRef={oldPasswordFieldRef}
        />
        <InputField
          name="password"
          label="New Password"
          type="password"
          error={formErrors.password}
          fieldRef={passwordFieldRef}
        />
        <InputField
          name="password2"
          label="New Password Again"
          type="password"
          error={formErrors.password2}
          fieldRef={password2FieldRef}
        />
        <Button variant="primary" type="submit">
          Change Password
        </Button>
      </Form>
    </Body>
  );
}
