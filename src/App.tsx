import { BrowserRouter, Routes, Route } from 'react-router';
import Login from '@/pages/Login';
import ProtectedRoute from '@/ProtectedRoute';
import CreateAccount from '@/pages/CreateAccount';
import Home from '@/pages/Home';
import { AuthProvider } from '@/AuthContext';
import TermDetails from '@/pages/TermDetails';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<CreateAccount />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/terms/:termId" element={<TermDetails />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
