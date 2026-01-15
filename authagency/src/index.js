// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AgentRegister from '../src/AgentRegister';
import Login from '../src/AgentLogIn';
import ForgotPassword from './ForgotPassword';
import Profile from './agentdashboard';
import './index.css';
import { Provider } from 'react-redux';
import {store}  from '../redux/store'; 

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>

    <Provider store={store}>
      <BrowserRouter>
        <Routes>

          <Route path="*" element={< AgentRegister />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path='/dashboard' element={<Profile/>} />



        </Routes>
      </BrowserRouter>
    </Provider>

  </React.StrictMode>

);