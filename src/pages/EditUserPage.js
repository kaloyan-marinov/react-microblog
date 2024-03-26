import { useState, useEffect, useRef } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import Body from "../components/Body";
import InputField from "../components/InputField";
import { useApi } from "../contexts/ApiProvider";
import { useUser } from "../contexts/UserProvider";
import { useFlash } from "../contexts/FlashProvider";

export default function EditUserPage() {
  const [formErrors, setFormErrors] = useState({});
  const usernameFieldRef = useRef();
  const emailFieldRef = useRef();
  const aboutMeFieldRef = useRef();
  const api = useApi();
  const { user, setUser } = useUser();
  const flash = useFlash();
  const navigate = useNavigate();

  useEffect(() => {
    usernameFieldRef.current.value = user.username;
    emailFieldRef.current.value = user.email;
    aboutMeFieldRef.current.value = user.about_me;

    usernameFieldRef.current.focus();
  }, [user]);

  const onSubmit = async (event) => {
    event.preventDefault();

    const response = await api.put("/me", {
      username: usernameFieldRef.current.value,
      email: emailFieldRef.current.value,
      about_me: aboutMeFieldRef.current.value,
    });

    if (response.ok) {
      setFormErrors({});
      setUser(response.body);
      flash("Your profile has been updated.", "success");
      navigate("/user/" + response.body.username);
    } else {
      setFormErrors(response.body.errors.json);
    }
  };

  return (
    <Body sidebar={true}>
      <Form onSubmit={onSubmit}>
        <InputField
          name="username"
          label="Username"
          error={formErrors.username}
          fieldRef={usernameFieldRef}
        />
        <InputField
          name="email"
          label="Email"
          error={formErrors.email}
          fieldRef={emailFieldRef}
        />
        <InputField
          name="aboutMe"
          label="About Me"
          error={formErrors.about_me}
          fieldRef={aboutMeFieldRef}
        />
        <Button variant="primary" type="submit">
          Save
        </Button>
      </Form>
    </Body>
  );
}
