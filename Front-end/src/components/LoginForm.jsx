'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import api from '../config/axios';

const mockUsers = [
  {
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    name: 'Admin User',
  },
  {
    email: 'manager@example.com',
    password: 'manager123',
    role: 'manager',
    name: 'Manager User',
  },
  {
    email: 'user@example.com',
    password: 'user123',
    role: 'user',
    name: 'Regular User',
  },
];

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setIsLoading(true);
      const { data } = await api.post('/auth/login', {
        email,
        password,
      });

      if (data) {
        localStorage.setItem('currentUser', JSON.stringify(data.data.user));
        localStorage.setItem(
          'rbac_system_access_token',
          JSON.stringify(data.data.accessToken)
        );
        navigate('/dashboard');
      }
    } catch (error) {
      setError('Invalid email or password');
    }
    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Enter your credentials to access the system
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="text-sm text-gray-600">
            <p>Demo credentials:</p>
            <p>Admin: admin@cms.com / Abc@12345</p>
            <p>Manager: manager@cms.com / Abc@12345</p>
            <p>User: user@cms.com / Abc@12345</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
