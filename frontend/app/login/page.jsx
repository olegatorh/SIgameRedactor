"use client";

import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/store/authSlice';
import './LoginComponent.css';
import { useRouter } from 'next/navigation';
import Link from "next/link";

const LoginComponent = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const router = useRouter();
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    await dispatch(login(credentials));
  };


  useEffect(() => {
    if (auth.isAuthenticated) {
      router.push('/');
    }
  }, [auth, router])

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <Link href="/register" className="nav-link">Registration</Link>
        {auth.isLoading && <p className="loading">Loading...</p>}
        {auth.error && <p className="error">Error: {auth.error}</p>}
      </div>
    </div>
  );
};


export default LoginComponent;