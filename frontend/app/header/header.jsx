"use client";

import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from "react-redux";
import { logout } from '@/store/authSlice';
import './Header.css';

const Header = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  return (
    <div>
      <header className="header">
        <nav className="nav">
          <div className="nav-left">
            <button className="nav-button" onClick={() => router.push('/')}>Home</button>
            {auth.access_token && (
              <button className="nav-button" onClick={() => router.push('/library')}>Quiz Library</button>
            )}
          </div>
          {auth.access_token && (
            <div className="nav-center">
              <button className="nav-button" onClick={() => router.push('/quiz')}>Quiz Redactor</button>
            </div>
          )}
          <div className="nav-right">
            {!auth.access_token ? (
              <>
                <button className="nav-button" onClick={() => router.push('/login')}>Login</button>
                <button className="nav-button" onClick={() => router.push('/register')}>Register</button>
              </>
            ) : (
              <button className="nav-button" onClick={handleLogout}>Logout</button>
            )}
          </div>
        </nav>
      </header>
      <main className="main-content">{children}</main>
    </div>
  );
};

export default Header;
