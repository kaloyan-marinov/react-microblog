import Form from "react-bootstrap/Form";

// An important part of implementing a form is
// to be able to read what the user enters in the form fields.
// There are two main techniques to handle user input in React,
// using _controlled_ or _uncontrolled_ components.
//
// A _controlled_ component is coded with event handlers
// that catch all changes to input fields.
// Every time a change handler triggers for a field,
// the updated contents of the field are copied to a React state variable.
// With this method,
// the values of the input fields for a form can be obtained from a state variable
// that acts as a mirror of the field.
//
// An _uncontrolled_ component, by contrast, does not have its value tracked by React.
// When the field's data is needed,
// DOM APIs are used to obtain it directly from the element.
//
// An often cited disadvantage of the controlled method,
// especially for forms with a large number of fields, is that
// every form field needs a state variable and one or more event handlers
// to capture all the changes the user can make to [the form field in question],
// making them tedious to write.
// Uncontrolled components also have some boilerplate code required,
// but overall they need significantly less code.
//
// For this project, the uncontrolled method will be used in all forms.
//
// When working with vanilla JavaScript,
// the standard method to reference an element is to give it an `id` attribute,
// which then makes it possible to retrieve the element
// with the `document.getElementById()` function.
// In complex applications
// it is difficult to maintain unique `id` values
// for all the elements that need to be addressed on the page,
// and it is easy to inadvertently introduce duplicates.
//
// React has a more elegant solution based on _references_.
// A reference eliminates the need
// to come up with a unique identifier for every element,
// a task that gets harder as the number of elements and page complexity grows.

export default function InputField({
  name,
  label,
  type,
  placeholder,
  error,
  fieldRef,
}) {
  // The `fieldRef` prop is not called `ref`,
  // because `ref` - similarly to `key` - is
  // an attribute name that React handles in a special way
  // and, consequently, cannot be used as a prop name.
  return (
    <Form.Group controlId={name} className="InputField">
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Control
        type={type || "text"}
        placeholder={placeholder}
        ref={fieldRef}
      />
      <Form.Text className="text-danger">{error}</Form.Text>
    </Form.Group>
  );
}
