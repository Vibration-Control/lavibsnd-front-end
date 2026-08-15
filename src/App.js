import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './containers/Home';
import NeutralizerOptimization from './containers/NeutralizerOptimization';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <div style={{ height: '5vh' }}>
          <Header />
        </div>

        <div style={{ height: '90vh', overflowY: 'auto' }}>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route
              path="/neutralizer-optimization"
              element={<NeutralizerOptimization />}
            />
          </Routes>
        </div>

        <div style={{ height: '5vh' }}>
          <Footer />
        </div>
      </div>
    </Router>
  );
};

export default App;