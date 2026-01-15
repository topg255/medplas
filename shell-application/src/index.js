import React from 'react';
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import Navbar from './navbar';
import ProfileSettings from './components/profileSet';
import AppointmentPage from './components/contact'
import Dashboard from './components/dashboard'
import './index.css';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <HashRouter>
      <Routes>
        <Route path="*" element={<Navbar />} />
        <Route path="/profile" element={<ProfileSettings />} />
        <Route path="/appointments" element={<AppointmentPage />} />
        <Route path="/dashboard" element={<Dashboard />} />

      </Routes>
    </HashRouter>

  </Provider>
);