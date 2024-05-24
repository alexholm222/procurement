import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import AppPurchase from './components/AppPurchase/AppPurchase';
import { Provider } from "react-redux";
import { store } from './store';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root_purchases'));
root.render(
  <Provider store={store}>
   <BrowserRouter>
      <AppPurchase />
      </BrowserRouter>
  </Provider>
);

