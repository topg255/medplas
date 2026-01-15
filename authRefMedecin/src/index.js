// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import DoctorRegister from '../src/DoctorRegister';
import DoctorLogIn from '../src/DoctorLogIn';
import ForgotPassword from './ForgotPassword';
import DoctorDashboard from './refdashboard';
import OtpVerification from './otp';
import { ResetPassword } from './ResetPassword';
import './index.css';
import { Provider } from 'react-redux';
import {store}  from '../redux/store'; 

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>

    <Provider store={store}>
      <HashRouter>
        <Routes>

          <Route path="/" element={< DoctorRegister />} />
          <Route path="/login_RefDoctor" element={<DoctorLogIn />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path='/dashboard' element={<DoctorDashboard />} />
          <Route path='/otp' element={<OtpVerification />} />
          <Route path="/forgotpassword/reset-password" element={<ResetPassword />} />



        </Routes>
      </HashRouter>
    </Provider>

  </React.StrictMode>

);