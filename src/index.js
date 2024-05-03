import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import AppPurchase from './components/AppPurchase/AppPurchase';
import { Provider } from "react-redux";
import { store } from './store';

const root = ReactDOM.createRoot(document.getElementById('root_purchases'));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <AppPurchase />
    </React.StrictMode>
  </Provider>
);

