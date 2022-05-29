import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/Stack";
import Sidebar from "./Sidebar";

export default function Body({ sidebar, children }) {
  // `sidebar` is the value of the `sidebar` attribute
  // `children` is the JSX component tree parented by this component

  return (
    <Container>
      <Stack direction="horizontal" className="Body">
        {sidebar && <Sidebar />}
        <Container className="Content">{children}</Container>
      </Stack>
    </Container>
  );
}
