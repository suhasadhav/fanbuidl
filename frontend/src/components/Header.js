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

// reactstrap components
import { Container, Row } from "reactstrap";
import { HeaderCard } from "./Subcomponents/HeaderCard";

const Header = ({ accounts, contract }) => {
  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            {/* Card stats */}
            <Row>
              <HeaderCard
                title="Active Subscriptions"
                icon="fa-chart-bar"
                iconBackground="bg-danger"
                accounts={accounts}
                method={contract.getActiveSubscriptionCount}
              />
              <HeaderCard
                title="Expiring Soon (7 Days)"
                icon="fa-chart-pie"
                iconBackground="bg-warning"
                accounts={accounts}
                method={contract.getExpiringSubscriptionCount}
              />
              <HeaderCard
                title="Followers"
                icon="fa-users"
                iconBackground="bg-yellow"
                accounts={accounts}
                method={contract.getExpiringSubscriptionCount}
              />

              <HeaderCard
                title="Creators on Chain"
                icon="fa-percent"
                iconBackground="bg-info"
                accounts={accounts}
                method={contract.getExpiringSubscriptionCount}
              />
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Header;
