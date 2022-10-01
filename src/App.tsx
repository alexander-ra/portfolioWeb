import React from 'react';
import './App.scss';
import Header from "./components/layout/Header";
import LandingPage from "./components/landing/LandingPage";
import store from "./store/store";
import { Provider } from 'react-redux';
import ContentManager from './components/core/ContentManager';

function App() {

  return (
      <Provider store={store}>
          <div className={"background"}></div>
          <div className="main-wrapper">
              <Header></Header>
              <ContentManager />
          </div>
      </Provider>
    );
}

export default App;
