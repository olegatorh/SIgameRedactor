"use client";

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '@/store/authSlice';
import './RegisterComponent.css';
import { useRouter } from "next/navigation";
import Link from "next/link";

const RegisterComponent = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const auth = useSelector((state) => state.auth);
  const [userData, setUserData] = useState({ email: '', password: '', password2: '', username: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    if (userData.password !== userData.password2) {
      setErrorMessage("Passwords do not match!");
    } else {
      setErrorMessage('');
      const dataToSend = { ...userData };
      delete dataToSend.password2;
      dispatch(register(dataToSend));
    }
  };

  useEffect(() => {
    if (auth.successMessage) {
      alert(auth.successMessage);
      router.push('/login');
    } else if (auth.error) {
      alert(auth.error);
    }
  }, [auth.successMessage, auth.error, router]);

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Registration</h2>
        <form onSubmit={handleRegister} className="register-form">
          <div className="input-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={userData.username}
              onChange={(e) => setUserData({ ...userData, username: e.target.value })}
            />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={userData.password}
              onChange={(e) => setUserData({ ...userData, password: e.target.value })}
            />
          </div>
          <div className="input-group">
            <label>Repeat Password</label>
            <input
              type="password"
              placeholder="Enter your password again"
              value={userData.password2}
              onChange={(e) => setUserData({ ...userData, password2: e.target.value })}
            />
          </div>
          <button type="submit" className="register-button">
            Register
          </button>
        </form>
        <Link href="/login" className="nav-link">Login</Link>
        {auth.isLoading && <p className="loading">Loading...</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default RegisterComponent;
