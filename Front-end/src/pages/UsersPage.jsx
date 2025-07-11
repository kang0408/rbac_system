'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';
import { UserManagement } from '../components/UserManagement';

export function UsersPage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      navigate('/');
      return;
    }

    const userData = JSON.parse(currentUser);
    if (
      userData.roles[0].name !== 'admin' &&
      userData.roles[0].name !== 'manager'
    ) {
      navigate('/dashboard');
      return;
    }

    setUser(userData);
  }, [navigate]);

  if (!user) {
    return <div>Loading...</div>;
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
