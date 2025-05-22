import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import './Home.css'; // Import custom CSS

const MainContent = () => {
  return (
    <>
      {/* Hero Section */}
      {/* <div className="hero-section text-center bg-light py-5">
        <Container>
					<img 
 						src="/Petrobras.png" 
  					alt="Petrobras Logo" 
  					className="float-start mb-3"
  					style={{ maxWidth: '200px' }}
					/>

					<h1>LavibsND</h1>
          <p>The ideal solution for vibration analysis and optimal neutralizer design.</p>

					<img 
 						src="/Lavibs_Horizontal.png" 
  					alt="LavibsND Logo" 
  					className="float-end mb-3"
  					style={{ maxWidth: '200px' }}
					/>

          
				</Container>
      </div> */}

			<div className="hero-section text-center bg-light py-5">
				<Container>
					<Row className="align-items-center justify-content-between">
						<Col xs={4} className="text-start">
							<img 
								src="/Petrobras.png" 
								alt="Petrobras Logo" 
								style={{ maxWidth: '250px' }}
							/>
						</Col>
						<Col xs={4}>
							<h1>LavibsND</h1>
						</Col>
						<Col xs={4} className="text-end">
							<img 
								src="/Lavibs_Horizontal.png" 
								alt="LavibsND Logo" 
								style={{ maxWidth: '250px' }}
							/>
						</Col>
					</Row>
					<Row className="mt-3">
						<Col>
							<p>The ideal solution for vibration analysis and optimal neutralizer design.</p>
						</Col>
					</Row>
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
      {/* About Section */}
      <Container className="my-5" id="about">
        <Row>
          <Col>
            <h2>About Us</h2>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Team Members</Card.Title>
                <Card.Text>
                  <strong>Developer:</strong> Eduardo Salmoria Fantin - <a href="https://www.linkedin.com/in/eduardo-salmoria-fantin-210305182/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                </Card.Text>
                <Card.Text>
                  <strong>Coordinator:</strong> Professor Carlos Alberto Bavastri
                </Card.Text>
                <Card.Text>
                  <strong>Acknowledgements:</strong> Professor José João de Espindola
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default MainContent;
