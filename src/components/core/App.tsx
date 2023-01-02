import React, {CSSProperties, Suspense} from 'react';
import './App.scss';
import store from "../../reducers/store";
import { Provider } from 'react-redux';
import AppEntry from "./AppEntry";

/**
 * App component. This component is responsible for displaying the whole application.
 * @constructor
 * @author Alexander Andreev
 */
function App() {

  return (
      <Provider store={store}>
          <AppEntry />
      </Provider>
    );
}

export default App;
