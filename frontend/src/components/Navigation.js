import React from "react";

import { Container, Navbar, Nav } from "react-bootstrap";
//import { NetworkErrorMessage } from "./NetworkErrorMessage";

export function Navigation() {
  return (
    <>
  <Navbar bg="dark" variant="dark">
    <Container>
    <Navbar.Brand href="#home">fanBuidl</Navbar.Brand>
    <Nav className="me-auto">
      <Nav.Link href="#home">Home</Nav.Link>
      <Nav.Link href="#subscriptions">My Subscriptions</Nav.Link>
      <Nav.Link href="#browse">Browse</Nav.Link>
    </Nav>
    </Container>
  </Navbar>
  
</>
  );
}
