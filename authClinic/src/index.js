// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import RegisterClinic from './RegsitreClinique';
import LoginClinique from './LoginClinique';
import ClinicDashboard from './Clinicdashboard';
import OtpVerification from './otp'
import './index.css';
import ForgotPassword from './ForgotPassword';
import { Provider } from 'react-redux';
import {store}  from './redux/store'; 

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>

  <Provider store={store}>
  <HashRouter>
    <Routes>
      
      <Route path="*" element={< RegisterClinic/>} />
      <Route path="/login_clinic" element={< LoginClinique/>} />
      <Route path="/forgotpassword" element={< ForgotPassword/>} />
      <Route path="/dashboard" element={<ClinicDashboard/>}/>
      <Route path="/otp" element={<OtpVerification/>} />






    </Routes>
  </HashRouter>
  </Provider>
  </React.StrictMode>
);