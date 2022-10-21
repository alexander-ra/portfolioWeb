import React from 'react';
import './App.scss';
import Header from "./components/layout/Header";
import LandingPage from "./components/landing/LandingPage";
import store from "./store/store";
import { Provider } from 'react-redux';
import ContentManager from './components/core/ContentManager';
import BackButton from "./components/layout/BackButton";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'

function App() {
    library.add(fab);
  return (
      <Provider store={store}>
          <div className={"background"}></div>
          <div className="main-wrapper">
              <Header></Header>
              <BackButton />
              <ContentManager />
          </div>
      </Provider>
    );
}

export default App;
