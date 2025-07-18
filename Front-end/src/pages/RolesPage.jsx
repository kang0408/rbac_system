import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';
import { RoleManagement } from '../components/RoleManagement';
import api from '../config/axios.js';

export function RolesPage() {
  const [user, setUser] = useState(null);
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

      const userData = currentUser;
      if (userData.roles[0].name !== 'admin') {
        navigate('/dashboard');
        return;
      }

      setUser(currentUser);
    };

    fetchUser();
  }, [navigate]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Role Management</h1>
          <p className="text-gray-600">Configure roles and permissions</p>
        </div>
        <RoleManagement />
      </div>
    </DashboardLayout>
  );
}
