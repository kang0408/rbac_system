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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Plus, Edit, Shield, Trash2 } from 'lucide-react';
import api from '../config/axios';

// const allPermissions = [
//   { id: 'user.read', name: 'Read Users', description: 'View user information' },
//   {
//     id: 'user.write',
//     name: 'Write Users',
//     description: 'Create and edit users',
//   },
//   {
//     id: 'user.delete',
//     name: 'Delete Users',
//     description: 'Remove users from system',
//   },
//   { id: 'role.read', name: 'Read Roles', description: 'View role information' },
//   {
//     id: 'role.write',
//     name: 'Write Roles',
//     description: 'Create and edit roles',
//   },
//   {
//     id: 'role.delete',
//     name: 'Delete Roles',
//     description: 'Remove roles from system',
//   },
//   {
//     id: 'system.admin',
//     name: 'System Admin',
//     description: 'Full system administration',
//   },
//   {
//     id: 'reports.read',
//     name: 'Read Reports',
//     description: 'View system reports',
//   },
//   {
//     id: 'settings.write',
//     name: 'Write Settings',
//     description: 'Modify system settings',
//   },
// ];

export function RoleManagement() {
  const [roles, setRoles] = useState([]);
  const [allPermissions, setAllPermissions] = useState([]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [newRole, setNewRole] = useState({
    name: '',
    permissions: [],
  });

  const handleAddRole = async () => {
    const role = {
      name: newRole.name,
      permissions: newRole.permissions,
    };

    try {
      const { data } = await api.post('/roles/create', role);

      if (data.status == 200) {
        getRoleData();
      }
    } catch (error) {
      console.log(error);
    }
    setNewRole({ name: '', permissions: [] });
    setIsAddDialogOpen(false);
  };

  const handleEditRole = async (role) => {
    try {
      const { data } = await api.patch(`/roles/update/${role.id}`, {
        name: role.name,
        permissions: role.permissions,
      });

      if (data.status == 200) {
        getRoleData();
      }
    } catch (error) {
      console.log(error);
    }
    setEditingRole(null);
  };

  const handlePermissionChange = (permissionId, checked, isEditing = false) => {
    if (isEditing && editingRole) {
      const updatedPermissions = checked
        ? [...editingRole.permissions, permissionId]
        : editingRole.permissions.filter((p) => p !== permissionId);
      setEditingRole({ ...editingRole, permissions: updatedPermissions });
    } else {
      const updatedPermissions = checked
        ? [...newRole.permissions, permissionId]
        : newRole.permissions.filter((p) => p !== permissionId);
      setNewRole({ ...newRole, permissions: updatedPermissions });
    }
  };

  const handleDeleteRole = async (role) => {
    console.log(role);
    try {
      const { data } = await api.delete(`/roles/delete/${role.id}`);

      if (data.status == 200) {
        getRoleData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getDetailsRole = async (roleId) => {
    try {
      const { data } = await api.get(`/roles/${roleId}`);

      if (data.status == 200) {
        setEditingRole(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getRoleData = async () => {
    try {
      const { data } = await api.get('/roles');

      if (data.status == 200) {
        setRoles(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getPermissionData = async () => {
    try {
      const { data } = await api.get('/permissions');

      if (data.status == 200) {
        setAllPermissions(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getRoleData();
    getPermissionData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Roles & Permissions</h2>
          <p className="text-gray-600">
            Configure system roles and their permissions
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Role</DialogTitle>
              <DialogDescription>
                Create a new role with specific permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Role Name</Label>
                <Input
                  id="name"
                  value={newRole.name}
                  onChange={(e) =>
                    setNewRole({ ...newRole, name: e.target.value })
                  }
                />
              </div>
              {/* <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newRole.description}
                  onChange={(e) =>
                    setNewRole({ ...newRole, description: e.target.value })
                  }
                />
              </div> */}
              <div>
                <Label>Permissions</Label>
                <div className="grid grid-cols-1 gap-3 mt-2 max-h-60 overflow-y-auto">
                  <ul className="list-disc ml-6">
                    {Object.keys(allPermissions).map((p) => (
                      <li key={p} className="mb-2 last:mb-0 space-x-2">
                        <p className="text-base">
                          {p.charAt(0).toUpperCase() + p.slice(1)}
                        </p>
                        {allPermissions[p].map((item) => (
                          <div key={item.id} className="flex items-start mb-1">
                            <Checkbox
                              id={item.id}
                              checked={newRole.permissions.includes(item.id)}
                              onCheckedChange={(checked) =>
                                handlePermissionChange(item.id, checked)
                              }
                            />
                            <div className="grid gap-1.5 leading-none ml-2">
                              <label
                                htmlFor={item.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {item.action.charAt(0).toUpperCase() +
                                  item.action.slice(1)}
                              </label>
                            </div>
                          </div>
                        ))}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddRole}>Add Role</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {roles.map((role) => (
          <Card key={role.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <CardTitle className="text-lg">{role.name}</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => getDetailsRole(role.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteRole(role)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {/* <CardDescription>{role.description}</CardDescription> */}
            </CardHeader>
            {/* <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Users:</span>
                  <Badge variant="secondary">{role.userCount}</Badge>
                </div>
                <div>
                  <span className="text-sm font-medium">Permissions:</span>
                  <div className="mt-2 space-y-1">
                    {role.permissions.slice(0, 3).map((permissionId) => {
                      const permission = allPermissions.find(
                        (p) => p.id === permissionId
                      );
                      return (
                        <div
                          key={permissionId}
                          className="text-xs text-gray-600"
                        >
                          • {permission?.name}
                        </div>
                      );
                    })}
                    {role.permissions.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{role.permissions.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent> */}
          </Card>
        ))}
      </div>

      {editingRole && (
        <Dialog open={!!editingRole} onOpenChange={() => setEditingRole(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Role</DialogTitle>
              <DialogDescription>
                Update role information and permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Role Name</Label>
                <Input
                  id="edit-name"
                  value={editingRole.name}
                  onChange={(e) =>
                    setEditingRole({ ...editingRole, name: e.target.value })
                  }
                />
              </div>
              {/* <div>
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  value={editingRole.description}
                  onChange={(e) =>
                    setEditingRole({
                      ...editingRole,
                      description: e.target.value,
                    })
                  }
                />
              </div> */}
              <div>
                <Label>Permissions</Label>
                <div className="grid grid-cols-1 gap-3 mt-2 max-h-60 overflow-y-auto">
                  <ul className="list-disc ml-6">
                    {Object.keys(allPermissions).map((p) => (
                      <li key={p} className="mb-2 last:mb-0 space-x-2">
                        <p className="text-base">
                          {p.charAt(0).toUpperCase() + p.slice(1)}
                        </p>
                        {allPermissions[p].map((item) => (
                          <div key={item.id} className="flex items-start mb-1">
                            <Checkbox
                              id={item.id}
                              checked={editingRole.permissions.includes(
                                item.id
                              )}
                              onCheckedChange={(checked) =>
                                handlePermissionChange(item.id, checked, true)
                              }
                            />
                            <div className="grid gap-1.5 leading-none ml-2">
                              <label
                                htmlFor={item.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {item.action.charAt(0).toUpperCase() +
                                  item.action.slice(1)}
                              </label>
                            </div>
                          </div>
                        ))}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingRole(null)}>
                Cancel
              </Button>
              <Button onClick={() => handleEditRole(editingRole)}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
