import React from "react";

import { Form, Button, Container } from "react-bootstrap";
//import { NetworkErrorMessage } from "./NetworkErrorMessage";

export function CreatorForm() {
  return (
    <Container className="mb-3">
      <Form>
        <Form.Group className="mb-3" controlId="formCreatorName">
          <Form.Label>Creator Account</Form.Label>
          <Form.Control type="text" placeholder="Enter your Account Name" />
          <Form.Text className="text-muted">
            This Name will be displayed as a public profile name
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formCreatorDesc">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            placeholder="You can explain your content here!"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Check me out" />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  );
}
