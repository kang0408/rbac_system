'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function ProtectedRoute({ children, requiredRoles = [] }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');

    if (!currentUser) {
      navigate('/');
      return;
    }

    const userData = JSON.parse(currentUser);

    if (
      requiredRoles.length > 0 &&
      !requiredRoles.includes(userData.roles[0].name)
    ) {
      navigate('/dashboard');
      return;
    }

    setUser(userData);
    setLoading(false);
  }, [navigate, requiredRoles]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return children;
}
