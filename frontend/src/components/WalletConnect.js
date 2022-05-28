import React from "react";
// reactstrap components

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Container,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWallet, faCheck } from "@fortawesome/free-solid-svg-icons";

export class WalletConnect extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <div className="main-content">
          <div className="header bg-gradient-info py-7 py-lg-8">
            <Container>
              <div className="header-body text-center mb-7">
                <Row className="justify-content-center">
                  <Col lg="5" md="6">
                    <h1 className="text-white">Welcome!</h1>
                  </Col>
                </Row>
              </div>
            </Container>
            <div className="separator separator-bottom separator-skew zindex-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                version="1.1"
                viewBox="0 0 2560 100"
                x="0"
                y="0"
              >
                <polygon
                  className="fill-default"
                  points="2560 0 2560 100 0 100"
                />
              </svg>
            </div>
          </div>
          {/* Page content */}
          <Container className="mt--8 pb-5">
            <Row className="justify-content-center">
              <Col lg="5" md="7">
                <Card className="bg-secondary shadow border-0">
                  <CardHeader className="bg-transparent pb-5">
                    <div className="text-muted text-center mt-2 mb-3">
                      <small>Sign in with</small>
                    </div>
                    <div className="btn-wrapper text-center">
                      <Button
                        className="btn-neutral btn-icon"
                        color="default"
                        onClick={this.props.onClick}
                      >
                        <span className="btn-inner--icon">
                          <FontAwesomeIcon icon={faWallet} size="lg" />
                        </span>
                        <span className="btn-inner--text">Metamask</span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardBody className="px-lg-0">
                    <ul className="text-muted text-left">
                      <p style={{ fontSize: "18px" }}>
                        <FontAwesomeIcon
                          icon={faCheck}
                          color="green"
                          size="lg"
                        />
                        {"  "}
                        Read-only access to wallet
                      </p>
                      <p style={{ fontSize: "18px" }}>
                        <FontAwesomeIcon
                          icon={faCheck}
                          color="green"
                          size="lg"
                        />
                        {"  "}
                        No access to Private keys
                      </p>
                      <p style={{ fontSize: "18px" }}>
                        <FontAwesomeIcon
                          icon={faCheck}
                          color="green"
                          size="lg"
                        />
                        {"  "}
                        No transaction without approval
                      </p>
                    </ul>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </>
    );
    //return <Redirect to="/admin" />;
  }
}

export default WalletConnect;
