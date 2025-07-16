import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';
import { UserManagement } from '../components/UserManagement';
import api from '../config/axios';

export function UsersPage() {
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
      if (
        userData.roles[0].name !== 'admin' &&
        userData.roles[0].name !== 'manager'
      ) {
        navigate('/dashboard');
        return;
      }

      setUser(userData);
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
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-gray-600">Manage users and their roles</p>
        </div>
        <UserManagement currentUserRole={user.roles[0].name} />
      </div>
    </DashboardLayout>
  );
}
