import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { FaCheckCircle } from "react-icons/fa";

export default function WalletConnect({ onClick }) {
  return (
    <>
      <Card style={{ width: "30rem" }}>
        <Card.Body align="left">
          <Card.Title style={{ fontSize: 25 }}>
            Know before you connect
          </Card.Title>
          <hr />
          <blockquote style={{ fontSize: 20 }}>
            <p>
              <FaCheckCircle color="green" /> Read-only Access
            </p>
            <p>
              <FaCheckCircle color="green" size="20" /> No access to Private
              Keys
            </p>
            <p>
              <FaCheckCircle color="green" size="20" /> No transaction without
              approval
            </p>
          </blockquote>
        </Card.Body>
        <Button variant="primary" onClick={onClick} style={{}}>
          Connect Wallet
        </Button>
      </Card>
    </>
  );
}
