import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/supabaseClient';
import { useAuth } from '@/useAuth';
import { useState } from 'react';
import { Navigate } from 'react-router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState<string | null>(null);

  const { session, loading } = useAuth();

  async function handleLogin() {
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      switch (error.code) {
        case 'invalid_credentials':
          setError('Invalid email or password');
          break;
        case 'email_not_confirmed':
          setError('Please confirm your email before logging in');
          break;
        case 'over_request_rate_limit':
          setError('Too many attempts. Please wait a moment and try again');
          break;
        default:
          setError('Something went wrong. Please try again');
      }
    }
  }

  if (loading) return <p>loading</p>;
  if (session) return <Navigate to="/" replace />;
  return (
    <div className="login-page">
      <form
        className="login-card"
        onSubmit={(e) => {
          e.preventDefault();
          void handleLogin();
        }}
      >
        <h1 className="login-title">Log in</h1>
        <div className="form-field">
          <Label>Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-field">
          <Label>Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <Button type="submit" className="login-button">
          Login
        </Button>
      </form>
    </div>
  );
}
