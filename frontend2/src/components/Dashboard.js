import { Container, Row, Col } from "react-bootstrap";
import Sidebar from "./Sidebar";
import AdminNavbar from "./AdminNavbar";
import Content from "./Content";
export default function Dashboard({ accounts }) {
  return (
    <Container fluid>
      <Row>
        <Col>
          1 of
          34555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555
        </Col>
        <Col>3 of 3</Col>

        <Sidebar />
        <AdminNavbar />
        <Content />
      </Row>
    </Container>
  );
}
