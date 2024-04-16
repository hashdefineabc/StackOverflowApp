// import React from 'react';
// import ReactDOM from 'react-dom';
// import './stylesheets/index.css';
// import FakeStackOverflow from './components/fakestackoverflow.js';

// ReactDOM.render(
//   <FakeStackOverflow />,
//   document.getElementById('root')
// );
import React from "react";
import ReactDOM from "react-dom/client";
import "./stylesheets/index.css";
import App from "./App";
import store from "./store";
import { Provider } from "react-redux";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Provider store={store}>
    <App />
  </Provider>,);
