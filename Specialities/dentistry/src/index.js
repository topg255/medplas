import React from 'react';
import ReactDOM from 'react-dom/client';
import Navbar from '../src/App'
import { BrowserRouter } from "react-router-dom";
import './index.css'
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Navbar />
  </BrowserRouter>
);