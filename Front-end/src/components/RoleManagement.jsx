"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Badge } from "./ui/badge"
import { Checkbox } from "./ui/checkbox"
import { Plus, Edit, Shield } from "lucide-react"

const allPermissions = [
  { id: "user.read", name: "Read Users", description: "View user information" },
  { id: "user.write", name: "Write Users", description: "Create and edit users" },
  { id: "user.delete", name: "Delete Users", description: "Remove users from system" },
  { id: "role.read", name: "Read Roles", description: "View role information" },
  { id: "role.write", name: "Write Roles", description: "Create and edit roles" },
  { id: "role.delete", name: "Delete Roles", description: "Remove roles from system" },
  { id: "system.admin", name: "System Admin", description: "Full system administration" },
  { id: "reports.read", name: "Read Reports", description: "View system reports" },
  { id: "settings.write", name: "Write Settings", description: "Modify system settings" },
]

export function RoleManagement() {
  const [roles, setRoles] = useState([
    {
      id: "1",
      name: "Admin",
      description: "Full system access",
      permissions: allPermissions.map((p) => p.id),
      userCount: 1,
    },
    {
      id: "2",
      name: "Manager",
      description: "User management and reporting",
      permissions: ["user.read", "user.write", "reports.read"],
      userCount: 1,
    },
    {
      id: "3",
      name: "User",
      description: "Basic user access",
      permissions: ["user.read"],
      userCount: 2,
    },
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState(null)
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: [],
  })

  const handleAddRole = () => {
    const role = {
      id: Date.now().toString(),
      name: newRole.name,
      description: newRole.description,
      permissions: newRole.permissions,
      userCount: 0,
    }
    setRoles([...roles, role])
    setNewRole({ name: "", description: "", permissions: [] })
    setIsAddDialogOpen(false)
  }

  const handleEditRole = (role) => {
    setRoles(roles.map((r) => (r.id === role.id ? role : r)))
    setEditingRole(null)
  }

  const handlePermissionChange = (permissionId, checked, isEditing = false) => {
    if (isEditing && editingRole) {
      const updatedPermissions = checked
        ? [...editingRole.permissions, permissionId]
        : editingRole.permissions.filter((p) => p !== permissionId)
      setEditingRole({ ...editingRole, permissions: updatedPermissions })
    } else {
      const updatedPermissions = checked
        ? [...newRole.permissions, permissionId]
        : newRole.permissions.filter((p) => p !== permissionId)
      setNewRole({ ...newRole, permissions: updatedPermissions })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Roles & Permissions</h2>
          <p className="text-gray-600">Configure system roles and their permissions</p>
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
              <DialogDescription>Create a new role with specific permissions.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Role Name</Label>
                <Input
                  id="name"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newRole.description}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                />
              </div>
              <div>
                <Label>Permissions</Label>
                <div className="grid grid-cols-1 gap-3 mt-2 max-h-60 overflow-y-auto">
                  {allPermissions.map((permission) => (
                    <div key={permission.id} className="flex items-start space-x-2">
                      <Checkbox
                        id={permission.id}
                        checked={newRole.permissions.includes(permission.id)}
                        onCheckedChange={(checked) => handlePermissionChange(permission.id, checked)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor={permission.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {permission.name}
                        </label>
                        <p className="text-xs text-muted-foreground">{permission.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
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
                <Button variant="outline" size="sm" onClick={() => setEditingRole(role)}>
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>{role.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Users:</span>
                  <Badge variant="secondary">{role.userCount}</Badge>
                </div>
                <div>
                  <span className="text-sm font-medium">Permissions:</span>
                  <div className="mt-2 space-y-1">
                    {role.permissions.slice(0, 3).map((permissionId) => {
                      const permission = allPermissions.find((p) => p.id === permissionId)
                      return (
                        <div key={permissionId} className="text-xs text-gray-600">
                          • {permission?.name}
                        </div>
                      )
                    })}
                    {role.permissions.length > 3 && (
                      <div className="text-xs text-gray-500">+{role.permissions.length - 3} more</div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingRole && (
        <Dialog open={!!editingRole} onOpenChange={() => setEditingRole(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Role</DialogTitle>
              <DialogDescription>Update role information and permissions.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Role Name</Label>
                <Input
                  id="edit-name"
                  value={editingRole.name}
                  onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  value={editingRole.description}
                  onChange={(e) => setEditingRole({ ...editingRole, description: e.target.value })}
                />
              </div>
              <div>
                <Label>Permissions</Label>
                <div className="grid grid-cols-1 gap-3 mt-2 max-h-60 overflow-y-auto">
                  {allPermissions.map((permission) => (
                    <div key={permission.id} className="flex items-start space-x-2">
                      <Checkbox
                        id={`edit-${permission.id}`}
                        checked={editingRole.permissions.includes(permission.id)}
                        onCheckedChange={(checked) => handlePermissionChange(permission.id, checked, true)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor={`edit-${permission.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {permission.name}
                        </label>
                        <p className="text-xs text-muted-foreground">{permission.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingRole(null)}>
                Cancel
              </Button>
              <Button onClick={() => handleEditRole(editingRole)}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
