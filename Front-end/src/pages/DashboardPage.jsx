'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Users, Shield, Settings, Activity } from 'lucide-react';
import api from '../config/axios';

export function DashboardPage() {
  const [user, setUser] = useState(null);
  const [stats, setStates] = useState(null);
  const navigate = useNavigate();

  const getStatistics = async () => {
    try {
      const { data } = await api.get('/statistics');

      if (data.status == 200) {
        setStates(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      navigate('/');
      return;
    }
    setUser(JSON.parse(currentUser));
  }, [navigate]);

  useEffect(() => {
    getStatistics();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, <span className="font-bold">{user.name}</span>
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stats
            ? stats.map((stat) => {
                const Icon =
                  stat.name === 'user'
                    ? Users
                    : stat.name == 'role'
                    ? Shield
                    : Settings;
                return (
                  <Card key={stat.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {stat.title}
                      </CardTitle>
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-muted-foreground">
                        {stat.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })
            : ''}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Role</CardTitle>
              <CardDescription>Current role and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              {user.roles ? (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Role:</span>
                    <span className="capitalize bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {user.roles[0].name}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {user.roles[0].name === 'admin' &&
                      'Full system access with all permissions'}
                    {user.roles[0].name === 'manager' &&
                      'User management and reporting access'}
                    {user.roles[0].name === 'user' &&
                      'Basic access to personal dashboard'}
                  </div>
                </div>
              ) : (
                ''
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Available actions based on your role
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {user.roles[0].name === 'admin' && (
                  <>
                    <div className="text-sm">• Manage all users</div>
                    <div className="text-sm">
                      • Configure roles and permissions
                    </div>
                    <div className="text-sm">• View system analytics</div>
                    <div className="text-sm">• Access admin settings</div>
                  </>
                )}
                {user.roles[0].name === 'manager' && (
                  <>
                    <div className="text-sm">• View user reports</div>
                    <div className="text-sm">• Manage team members</div>
                    <div className="text-sm">• Access analytics dashboard</div>
                  </>
                )}
                {user.roles[0].name === 'user' && (
                  <>
                    <div className="text-sm">• View personal profile</div>
                    <div className="text-sm">• Update account settings</div>
                    <div className="text-sm">• Access assigned resources</div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
