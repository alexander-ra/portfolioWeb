import React, {CSSProperties, Suspense} from 'react';
import './App.scss';
import store from "./store/store";
import { Provider } from 'react-redux';
import AppEntry from "./components/core/AppEntry";

function App() {

  return (
      <Provider store={store}>
          <AppEntry />
      </Provider>
    );
}

export default App;
