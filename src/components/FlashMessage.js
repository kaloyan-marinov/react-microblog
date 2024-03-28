import { useContext } from "react";
import Alert from "react-bootstrap/Alert";
import Collapse from "react-bootstrap/Collapse";
import { FlashContext } from "../contexts/FlashProvider";

export default function FlashMessage() {
  const { flashMessage, visible, hideFlash } = useContext(FlashContext);

  // Since what this component renders to the DOM is wrapped within a `<Collapse>`,
  // writing an test for whether the "`<Alert>`" closes automatically after X seconds
  // is complicated by that top-level `<Collapse>`.
  // The complication resides in
  // the following implementation detail related to `<Collapse>`:
  // it (and therefore its contents) aren't ever removed or hidden;
  // instead, it uses CSS transitions to shrink the "alert"
  // until it reaches a height of 0 pixels (instead of actually hiding it).
  //
  // One way to facilitate writing the above-mentioned test
  // relies on having knowledge of the inner workings of the `Collapse` component,
  // which is suboptimal
  // because the test could break if React-Bootstrap is upgraded to a new version.
  //
  // A surprisingly simple solution is to add a custom data attribute to the `<Alert>`
  // indicating whether it is visible or not.
  return (
    <Collapse in={visible}>
      <div>
        <Alert
          variant={flashMessage.type || "info"}
          dismissible
          onClose={hideFlash}
          data-visible={visible}
        >
          {flashMessage.message}
        </Alert>
      </div>
    </Collapse>
  );
}
