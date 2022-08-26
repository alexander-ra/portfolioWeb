import React from 'react';
import './App.scss';
import Loader from "./components/landing/Loader";
import PreviewText from "./components/landing/PreviewText";

function App() {
  return (
      <div className="main-wrapper">
        <PreviewText />
        <Loader/>
    </div>
    );
}

export default App;
