/*!

=========================================================
* Argon Dashboard React - v1.2.1
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// javascipt plugin for creating charts
import React from "react";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  Progress,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap";

import Header from "./Header.js";

// Contract Specific imports
import Web3 from "web3";
import contractAddress from "../contracts/contract-address.json";
import FanbuidlArtifact from "../contracts/Fanbuidl.json";

const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

export class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.contract = new web3.eth.Contract(
      FanbuidlArtifact.abi,
      contractAddress.Fanbuidl
    );
  }

  getContractOwner() {
    this.contract.methods.getOwner().call().then(console.log);
    /*contract.methods
      .getOwner()
      .send({ from: "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720" })
      .on("receipt", function (receipt) {
        console.log(" Receipt:" + receipt);
      })
      .on("confirmation", function (confirmationNumber, receipt) {
        console.log("Confirmation");
        console.log(
          "confirmationNumber: " + confirmationNumber + " Receipt:" + receipt
        );
      })
      .on("error", function (error, receipt) {
        console.log("error Occurred: " + error + " Receipt:" + receipt);
      });*/
  }

  render() {
    //console.log("Get all acc");
    //web3.eth.getAccounts().then(console.log);
    return (
      <>
        <Header accounts={this.props.accounts} contract={this.contract} />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row className="mt-5">
            <Col className="mb-5 mb-xl-0" xl="8">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <div className="col">
                      <h3 className="mb-0">Your Content</h3>
                    </div>
                    <div className="col text-right">
                      <Button
                        color="primary"
                        href="#"
                        onClick={(e) => {
                          //e.preventDefault();
                          this.getContractOwner();
                        }}
                        size="sm"
                      >
                        Get Owner
                      </Button>
                    </div>
                  </Row>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Creator</th>
                      <th scope="col">Visitors</th>
                      <th scope="col">Posted On</th>
                      <th scope="col">Last 24h</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">/argon/</th>
                      <td>4,569</td>
                      <td>340</td>
                      <td>
                        <i className="fas fa-arrow-up text-success mr-3" />{" "}
                        46,53%
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Card>
            </Col>
            <Col xl="4">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <div className="col">
                      <h3 className="mb-0">Top Creators</h3>
                    </div>
                    <div className="col text-right">
                      <Button
                        color="primary"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        size="sm"
                      >
                        See all
                      </Button>
                    </div>
                  </Row>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Referral</th>
                      <th scope="col">Visitors</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">{this.props.accounts}</th>
                      <td>1,480</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="mr-2">60%</span>
                          <div>
                            <Progress
                              max="100"
                              value="60"
                              barClassName="bg-gradient-danger"
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
    //return <Redirect to="/admin" />;
  }
}

export default Dashboard;
