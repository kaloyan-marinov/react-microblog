import { useState, useEffect } from "react";
import Stack from "react-bootstrap/Stack";
import Image from "react-bootstrap/Image";
import Spinner from "react-bootstrap/Spinner";
import { useParams } from "react-router-dom";
import Body from "../components/Body";
import TimeAgo from "../components/TimeAgo";
import { useApi } from "../contexts/ApiProvider";
import Posts from "../components/Posts";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserProvider";
import { useFlash } from "../contexts/FlashProvider";

export default function UserPage() {
  const { username } = useParams();
  const [user, setUser] = useState();
  const api = useApi();
  const [isFollower, setIsFollower] = useState();
  const { user: loggedInUser } = useUser();
  const flash = useFlash();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const response = await api.get("/users/" + username);

      if (response.ok) {
        setUser(response.body);

        if (response.body.username !== loggedInUser.username) {
          console.log("issuing request");
          const follower = await api.get("/me/following/" + response.body.id);
          if (follower.status === 204) {
            setIsFollower(true);
          } else if (follower.status === 404) {
            setIsFollower(false);
          }
        } else {
          setIsFollower(null);
        }
      } else {
        // The written tutorial says:
        setUser(null);
        // But the repository uses
        // `setUser(undefined)`;
      }
    })();
  }, [username, api, loggedInUser]);

  const edit = () => {
    navigate("/edit");
  };

  const follow = async () => {
    const response = await api.post("/me/following/" + user.id);

    if (response.ok) {
      // The first argument in the following call
      // is not a plain string but a JSX fragment;
      // that makes it possible to use a bold font for the username.
      // (Using a plain string with HTML elements
      // such as "You are now following <b>{user.username}</b>." in this case,
      // would not work,
      // because, as a measure to prevent cross-site scripting (XSS) attacks,
      // React escapes all text that is rendered.
      flash(
        <>
          You are now following <b>{user.username}</b>.
        </>,
        "success"
      );

      setIsFollower(true);
    }
  };

  const unfollow = async () => {
    const response = await api.delete("/me/following/" + user.id);

    if (response.ok) {
      // The first argument in the following call
      // is not a plain string but a JSX fragment;
      // that makes it possible to use a bold font for the username.
      // (Using a plain string with HTML elements
      // such as "You have unfollowed <b>{user.username}</b>." in this case,
      // would not work,
      // because, as a measure to prevent cross-site scripting (XSS) attacks,
      // React escapes all text that is rendered.
      flash(
        <>
          You have unfollowed <b>{user.username}</b>.
        </>,
        "success"
      );

      setIsFollower(false);
    }
  };

  return (
    <Body sidebar>
      {user === undefined ? (
        <Spinner animation="border" />
      ) : (
        <>
          {user === null ? (
            <p>User not found.</p>
          ) : (
            <>
              <Stack direction="horizontal" gap={4}>
                <Image src={user.avatar_url + "&s=128"} roundedCircle />
                <div>
                  <h1>{user.username}</h1>
                  {user.about_me && <h5>{user.about_me}</h5>}
                  <p>
                    Member since: <TimeAgo isoDate={user.first_seen} />
                    <br />
                    Last seen: <TimeAgo isoDate={user.last_seen} />
                  </p>
                  {isFollower === null && (
                    <Button variant="primary" onClick={edit}>
                      Edit
                    </Button>
                  )}
                  {isFollower === false && (
                    <Button variant="primary" onClick={follow}>
                      Follow
                    </Button>
                  )}
                  {isFollower === true && (
                    <Button variant="primary" onClick={unfollow}>
                      Unfollow
                    </Button>
                  )}
                </div>
              </Stack>
              <Posts content={user.id} />
            </>
          )}
        </>
      )}
    </Body>
  );
}
