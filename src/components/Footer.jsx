import React from 'react';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Footer.css'; // Import custom CSS

const Footer = () => {
  return (
    <footer className="bg-dark text-white text-center py-4">
      <Container>
        <p>&copy; 2024 LavibsND. All rights reserved.</p>
      </Container>
    </footer>
  );
};

export default Footer;
