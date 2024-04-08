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
import { BrowserRouter } from 'react-router-dom'
import "./stylesheets/index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);