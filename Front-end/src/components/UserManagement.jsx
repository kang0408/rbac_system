import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Badge } from './ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';

import api from '../config/axios';

export function UserManagement({ currentUserRole }) {
  const [users, setUsers] = useState();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: '',
  });
  const [availableRoles, setAvailableRoles] = useState([]);
  const [availableStatus] = useState(['active', 'inactive']);

  const handleAddUser = async () => {
    try {
      const user = {
        name: newUser.name,
        email: newUser.email,
        roles: [newUser.role],
        status: 'inactive',
      };
      const { data } = await api.post('/users/create', user);

      if (data.status == 200) {
        getUserData();
      }
    } catch (error) {
      console.log(error);
    }
    setNewUser({ name: '', email: '', role: '' });
    setIsAddDialogOpen(false);
  };

  const handleSetEditUser = (user) => {
    setEditingUser({
      name: user.name,
      email: user.email,
      role: user.roles[0].id,
      status: user.status,
    });
    setEditingUserId(user._id);
  };

  const handleEditUser = async (user) => {
    try {
      const { data } = await api.patch(`/users/update/${editingUserId}`, {
        ...user,
        roles: [user.role],
      });

      if (data.status == 200) {
        getUserData();
      }
    } catch (error) {
      console.log(error);
    }
    setEditingUser(null);
  };

  const handleDeleteUser = async (userId) => {
    try {
      const { data } = await api.delete(`/users/delete/${userId}`);

      if (data.status == 200) {
        getUserData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const canEditRole = (userRole) => {
    if (currentUserRole === 'admin') return true;
    if (currentUserRole === 'manager' && userRole !== 'admin') return true;
    return false;
  };

  const getUserData = async () => {
    try {
      const { data } = await api.get('/users?limit=20');

      setUsers(data.data.users);
    } catch (error) {}
  };

  const getRoles = async () => {
    try {
      const { data } = await api.get('/roles');

      setAvailableRoles(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserData();
    getRoles();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Users</h2>
          <p className="text-gray-600">Manage system users and their roles</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account with appropriate role assignment.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) =>
                    setNewUser({ ...newUser, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddUser}>Add User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {users ? (
        <Card>
          <CardHeader>
            <CardTitle>User List</CardTitle>
            <CardDescription>
              All users in the system with their roles and status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.roles[0] ? (
                        <Badge
                          variant={
                            user.roles[0].name === 'admin'
                              ? 'destructive'
                              : user.roles[0].name === 'manager'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {user.roles[0].name}
                        </Badge>
                      ) : (
                        ''
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.status === 'active' ? 'default' : 'secondary'
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toUTCString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {canEditRole(user.roles[0].name) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetEditUser(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {canEditRole(user.roles[0].name) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        ''
      )}

      {editingUser && (
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user information and role assignment.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editingUser.name}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-role">Role</Label>
                <Select
                  value={editingUser.role}
                  onValueChange={(value) =>
                    setEditingUser({ ...editingUser, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={editingUser.status}
                  onValueChange={(value) =>
                    setEditingUser({ ...editingUser, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStatus.map((status, idx) => (
                      <SelectItem key={idx} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingUser(null)}>
                Cancel
              </Button>
              <Button onClick={() => handleEditUser(editingUser)}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
