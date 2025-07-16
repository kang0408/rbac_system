import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/axios';

export function ProtectedRoute({ children, requiredRoles = [] }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getMe = async () => {
    const { data } = await api.get('/auth/me');
    return data.data.user;
  };

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getMe();

      if (!currentUser) {
        navigate('/');
        return;
      }

      if (
        requiredRoles.length > 0 &&
        !requiredRoles.includes(currentUser.roles[0].name)
      ) {
        navigate('/dashboard');
        return;
      }

      setUser(currentUser);
      setLoading(false);
    };

    fetchUser();
  }, []);

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
