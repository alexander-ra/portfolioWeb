import React from 'react';
import './App.scss';
import Loader from "./components/landing/Loader";
import PreviewText from "./components/landing/PreviewText";
import Devices from "./components/landing/Devices";

function App() {
  return (
      <div className="main-wrapper">
        <PreviewText />
        <Loader/>
        <Devices />
    </div>
    );
}

export default App;
