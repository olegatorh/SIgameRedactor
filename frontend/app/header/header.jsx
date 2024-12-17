"use client";

import {useRouter} from 'next/navigation';
import {useDispatch, useSelector} from "react-redux";
import './Header.css';
import {resetQuizState} from "@/store/quizSlice";
import {logout} from "@/store/authSlice";

const Header = ({children}) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        dispatch(resetQuizState());
        router.push('/login');
    };

    return (
        <div>
            <header className="header">
                <nav className="nav">
                    <div className="nav-left">
                        <button className="nav-button" onClick={() => router.push('/')}>Home</button>
                        {auth.isAuthenticated && (
                            <>
                                <div className="nav-center">
                                    <button className="nav-button" onClick={() => router.push('/library')}>Quiz
                                        Library
                                    </button>
                                </div>
                                <div className="nav-center">
                                    <button className="nav-button" onClick={() => router.push('/drafts')}>My drafts
                                    </button>
                                </div>
                            </>
                        )
                        }
                    </div>
                    {
                        auth.isAuthenticated && (
                            <div className="nav-center">
                                <button className="nav-button" onClick={() => router.push('/quiz')}>Quiz Redactor</button>
                            </div>
                        )}
                    <div className="nav-right">
                        {!auth.isAuthenticated ? (
                            <>
                                <button className="nav-button" onClick={() => router.push('/login')}>Login</button>
                                <button className="nav-button" onClick={() => router.push('/register')}>Register
                                </button>
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
