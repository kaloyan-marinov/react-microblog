import { useState, useEffect, useRef } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate, useLocation } from "react-router-dom";
import Body from "../components/Body";
import InputField from "../components/InputField";
import { useApi } from "../contexts/ApiProvider";
import { useFlash } from "../contexts/FlashProvider";

export default function ResetPage() {
  const [formErrors, setFormErrors] = useState({});
  const passwordFieldRef = useRef();
  const password2FieldRef = useRef();
  const navigate = useNavigate();
  const { search } = useLocation();
  const api = useApi();
  const flash = useFlash();

  const token = new URLSearchParams(search).get("token");

  useEffect(() => {
    if (!token) {
      // If the client-side route, at which this component is rendered,
      // lacks a `token` query parameter,
      // it makes no sense to invoke that route at all.
      navigate("/");
    } else {
      passwordFieldRef.current.focus();
    }
  }, [token, navigate]);

  const onSubmit = async (event) => {
    event.preventDefault();

    if (passwordFieldRef.current.value !== password2FieldRef.current.value) {
      setFormErrors({
        password2: "New passwords don't match",
      });
    } else {
      const response = await api.put("/tokens/reset", {
        token,
        new_password: passwordFieldRef.current.value,
      });

      if (response.ok) {
        setFormErrors({});
        flash("Your password has been reset.", "success");
        navigate("/login");
      } else {
        if (response.body.errors.json.new_password) {
          setFormErrors(response.body.errors.json);
        } else {
          // In other words, the error response does not include
          // validation issues on the password field.
          // (This could happen if the user attempts to use a reset link
          // after the token has expired.)
          flash("Password could not be reset. Please try again.", "danger");
          navigate("/reset-request");
        }
      }
    }
  };

  return (
    <Body>
      <Form onSubmit={onSubmit}>
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
          Reset Password
        </Button>
      </Form>
    </Body>
  );
}
