import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import quizApiReducer from './quizSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    quizApi: quizApiReducer,
  },
});

export default store;