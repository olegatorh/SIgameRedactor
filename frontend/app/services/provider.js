"use client";

import { Provider } from 'react-redux';
import store from '../../store/store';
import ProtectedRoute from "@/app/services/protectedProvider";

export default function Providers({ children }) {
  return <Provider store={store}>
      {children}
  </Provider>;
}