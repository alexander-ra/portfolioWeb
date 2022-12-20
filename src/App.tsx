import React, { Suspense } from 'react';
import './App.scss';
import store from "./store/store";
import { Provider } from 'react-redux';
const AppDecorator = React.lazy(() => import('./components/core/AppDecorator')); // Lazy-loaded
const ContentManager = React.lazy(() => import('./components/core/ContentManager')); // Lazy-loaded
const Header = React.lazy(() => import('./components/layout/Header')); // Lazy-loaded

function App() {
  return (
      <Provider store={store}>
          <div className={"device-frame"}></div>
          <div className={"parent-wrapper"}>
              <AppDecorator />
              <div className={"app-wrapper"}>
                  <Suspense>
                      <Header />
                  </Suspense>
                  <Suspense>
                      <ContentManager />
                  </Suspense>
              </div>
          </div>
      </Provider>
    );
}

export default App;
