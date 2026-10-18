import { BrowserRouter, Routes, Route } from 'react-router';
import Login from '@/pages/Login';
import ProtectedRoute from '@/ProtectedRoute';
import CreateAccount from '@/pages/CreateAccount';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<CreateAccount />} />

        <Route element={<ProtectedRoute />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
