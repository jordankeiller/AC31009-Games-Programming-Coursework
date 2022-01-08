// Import relevant react libraries
import React from 'react';
import ReactDOM from 'react-dom';

// Import mdbreact/bootstrap
import '@fortawesome/fontawesome-free/css/all.min.css'; 
import 'bootstrap-css-only/css/bootstrap.min.css'; 
import "mdbreact/dist/css/mdb.css"

// Import the entire app component (the entire website)
import App from './App';

ReactDOM.render(
  <React.StrictMode>

    
    {/* Render the app component into the "root" ID provided by index.html */}
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

