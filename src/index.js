// index.js

import React from 'react';
import { createRoot } from 'react-dom/client'; // Updated import statement
import { Provider } from 'react-redux';
import App from './App';
import store from './redux/store';

// Use createRoot from react-dom/client
const root = createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
