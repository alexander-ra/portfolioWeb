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
import DeviceSimulator from "./components/layout/DeviceSimulator";

function App() {
    library.add(fab);
  return (
      <Provider store={store}>
          <div className={"parent-wrapper"}>
              <div className={"background"} />
              <div className={"app-wrapper"}>
                  <Header></Header>
                  <BackButton />
                  <ContentManager />
                  <DeviceSimulator />
              </div>
          </div>
      </Provider>
    );
}

export default App;
