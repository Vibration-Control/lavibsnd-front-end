import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import './Home.css'; // Import custom CSS

const MainContent = () => {
  return (
    <>
      {/* Hero Section */}
      <div className="hero-section text-center bg-light py-5">
        <Container>
          <h1>LavibsND</h1>
          <p>The ideal solution for vibration analysis and optimal neutralizer design.</p>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="my-5" id="features">
        <Row>
          <Col md={4}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Real-Time Analysis</Card.Title>
                <Card.Text>
                  Our software leverages Generalized Equivalent Parameters methodology for immediate insights.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Accurate Results</Card.Title>
                <Card.Text>
                  Utilizes advanced algorithms to ensure accurate vibration neutralization.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>User-Friendly Interface</Card.Title>
                <Card.Text>
                  Our intuitive interface makes neutralizer design simple and efficient.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* About Section */}
      <Container className="my-5" id="about">
        <Row>
          <Col>
            <h2>About Us</h2>
            <p>
              LavibsND is dedicated to providing the best vibration neutralization solutions to help you maintain optimal machine performance and extend equipment lifespan.
            </p>
            <p>
              Created by <a href="https://www.linkedin.com/in/eduardo-salmoria-fantin-210305182/" target="_blank" rel="noopener noreferrer">Eduardo Salmoria Fantin</a>.
            </p>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default MainContent;
