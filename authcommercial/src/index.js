import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../redux/store'; // adapte le chemin

import MedicalTouristLogin from './components/authUtilisatuer/Login';
import SignIn from './components/authUtilisatuer/SignIn';
import ForgotPassword from './components/authUtilisatuer/ForgotPassword';
import Profile from './components/authUtilisatuer/commercialdashboard'

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

const root = createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <HashRouter>
      <Routes>
        <Route path="/login" element={<MedicalTouristLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path='/dashboard' element={<Profile/>}/>
        <Route path="*" element={<SignIn />} />
      </Routes>
    </HashRouter>
  </Provider>
);
