import Form from "react-bootstrap/Form";

export default function InputField({
  name,
  label,
  type,
  placeholder,
  error,
  fieldRef,
}) {
  // A `ref` prop provides a way for the frontend app to interact with a rendered element.
  // You will learn about React references in detail later in this chapter.
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
