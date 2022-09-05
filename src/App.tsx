import React from 'react';
import './App.scss';
import Header from "./components/layout/Header";
import LandingCube from "./components/landing/LandingCube";

function App() {

  return (
      <div className="main-wrapper">
          <Header></Header>
          <LandingCube></LandingCube>
      </div>
    );
}

export default App;
