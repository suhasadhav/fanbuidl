import { useEffect, useState } from "react";
import { Card, CardBody, CardTitle, Row, Col } from "reactstrap";

import LoadingSpinner from "./LoadingSpinner";
export const HeaderCard = ({
  title,
  icon,
  iconBackground,
  accounts,
  method,
}) => {
  const [count, setCount] = useState(0);
  // TODO: Loading for each component
  const [isLoading, setIsLoading] = useState(true);

  function getCount() {
    setIsLoading(true);
    try {
      method(accounts[0]).then((result, err) => {
        if (err) {
          console.log("Error occurred");
          setCount(0);
        } else {
          setCount(result.toString());
        }
      });
    } catch (e) {
      setCount(0);
      console.error("HeaderCard: " + e);
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    getCount();
  });

  return (
    <>
      <Col lg="6" xl="3">
        <Card className="card-stats mb-4 mb-xl-0">
          <CardBody>
            {isLoading && <LoadingSpinner />}

            {!isLoading && (
              <>
                <Row>
                  <div className="col">
                    <CardTitle
                      tag="h5"
                      className="text-uppercase text-muted mb-0"
                    >
                      {title}
                    </CardTitle>
                    <span className="h2 font-weight-bold mb-0">{count}</span>
                  </div>
                  <Col className="col-auto">
                    <div
                      className={`icon icon-shape ${iconBackground} text-white rounded-circle shadow`}
                    >
                      <i className={`fas ${icon}`} />
                    </div>
                  </Col>
                </Row>
                <p className="mt-3 mb-0 text-muted text-sm">
                  <span className="text-success mr-2">
                    <i className="fa fa-arrow-up" /> 3.48%
                  </span>{" "}
                  <span className="text-nowrap">Since last month</span>
                </p>
              </>
            )}
          </CardBody>
        </Card>
      </Col>
    </>
  );
};
