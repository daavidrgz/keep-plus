import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import LoadingPage from './components/LoadingPage';

ReactDOM.render(
  <React.StrictMode>
    <LoadingPage />
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
