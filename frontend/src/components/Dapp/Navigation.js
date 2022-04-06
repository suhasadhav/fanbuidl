import React from "react";

import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
//import { NetworkErrorMessage } from "./NetworkErrorMessage";

export function Navigation({address}) {
  return (
    <>
  <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
  <Container>
  <Navbar.Brand href="#home">fanBuidl</Navbar.Brand>
  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
  <Navbar.Collapse id="responsive-navbar-nav">
    <Nav className="me-auto">
      <NavDropdown title="Subscriptions" id="collasible-nav-dropdown">
        <NavDropdown.Item href="#activeSubscriptions">My Subscriptions</NavDropdown.Item>
        <NavDropdown.Item href="#dueSubscriptions">Due Subscriptions</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item href="#action/3.4">Billing History</NavDropdown.Item>
      </NavDropdown>
      <Nav.Link href="#pricing">Browse</Nav.Link>
    </Nav>
    
    <Nav className="me-auto" align="right">
      <NavDropdown title={address} id="collasible-nav-dropdown">
        <NavDropdown.Item href="#logout">Logout</NavDropdown.Item>
      </NavDropdown>
    </Nav>
    
  </Navbar.Collapse>
  </Container>
</Navbar>
  
</>
  );
}

