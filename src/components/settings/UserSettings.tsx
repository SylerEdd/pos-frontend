import { useEffect, useState } from "react";
import { getAllUsers, createUser, updateUser } from "../../api/userApi";
import { getAllRoles, createRole } from "../../api/roleApi";
import { Plus, Pencil, Check, X } from "lucide-react";

interface User {
  id: number;
  fullName: string;
  username: string;
  email: string;
  roles: string[];
  createdAt: string;
}

interface Role {
  id: number;
  name: string;
}

export function UserSettings() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [adding, setAdding] = useState(false);
  const [formError, setFormError] = useState("");

  const [newFullName, setNewFullName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<string>("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFullName, setEditFullName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editRole, setEditRole] = useState<string>("");
  const [editError, setEditError] = useState("");

  const [roles, setRoles] = useState<Role[]>([]);
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [roleError, setRoleError] = useState("");
  const [addingRole, setAddingRole] = useState(false);

  const RoleIdMap = Object.fromEntries(roles.map((r) => [r.name, r.id]));

  const fetchUsers = () => {
    setIsLoading(true);
    getAllUsers()
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Failed to load users", err))
      .finally(() => setIsLoading(false));
  };

  const fetchRoles = () => {
    getAllRoles()
      .then((res) => {
        setRoles(res.data);
        if (res.data.length > 0) {
          setNewRole(res.data[0].name);
          setEditRole(res.data[0].name);
        }
      })
      .catch((err) => console.error("Failed to load roles", err));
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const handleAdd = async () => {
    if (!newFullName.trim()) {
      setFormError("Full name is required");
      return;
    }
    if (!newUsername.trim()) {
      setFormError("Username is required");
      return;
    }
    if (!newEmail.trim()) {
      setFormError("Email is required");
      return;
    }
    if (!newPassword.trim()) {
      setFormError("Password is required");
      return;
    }
    if (!newRole) {
      setFormError("Role is required");
      return;
    }

    const isDuplicate = users.some(
      (u) => u.username.toLowerCase() === newUsername.trim().toLowerCase(),
    );
    if (isDuplicate) {
      setFormError(`"${newUsername}" already exists`);
      return;
    }

    try {
      setAdding(true);
      await createUser({
        fullName: newFullName.trim(),
        username: newUsername.trim(),
        email: newEmail.trim(),
        password: newPassword,
        roles: [RoleIdMap[newRole]],
      });
      setNewFullName("");
      setNewUsername("");
      setNewEmail("");
      setNewPassword("");
      setNewRole(roles[0]?.name ?? "");
      setShowForm(false);
      setFormError("");
      fetchUsers();
    } catch (err) {
      console.error("Failed to create user", err);
      setFormError("Failed to create user, try again.");
    } finally {
      setAdding(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setEditFullName(user.fullName);
    setEditUsername(user.username);
    setEditEmail(user.email);
    setEditPassword("");
    const currentRole = user.roles[0] ?? roles[0]?.name ?? "";
    setEditRole(currentRole);
    setEditError("");
  };

  const handleConfirmEdit = async (id: number) => {
    if (!editFullName.trim()) {
      setEditError("Full name is required");
      return;
    }
    if (!editUsername.trim()) {
      setEditError("Username is required");
      return;
    }
    if (!editEmail.trim()) {
      setEditError("Email is required");
      return;
    }

    const payload: {
      fullName: string;
      username: string;
      email: string;
      roles: number[];
      password?: string;
    } = {
      fullName: editFullName.trim(),
      username: editUsername.trim(),
      email: editEmail.trim(),
      roles: [RoleIdMap[editRole]],
    };

    if (editPassword.trim()) {
      payload.password = editPassword;
    }

    try {
      await updateUser(id, payload);
      handleCancelEdit();
      fetchUsers();
    } catch (err) {
      console.error("Failed to update user", err);
      setEditError("Failed to update user, try again.");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditError("");
  };

  const handleAddRole = async () => {
    if (!newRoleName.trim()) {
      setRoleError("Role name is required");
      return;
    }

    const isDuplicate = roles.some(
      (r) => r.name.toLowerCase() === newRoleName.trim().toLowerCase(),
    );
    if (isDuplicate) {
      setRoleError(`"${newRoleName}" already exists`);
      return;
    }

    try {
      setAddingRole(true);
      await createRole({ name: newRoleName.trim().toUpperCase() });
      setNewRoleName("");
      setShowRoleForm(false);
      setRoleError("");
      fetchRoles();
    } catch (err) {
      console.error("Failed to create role", err);
      setRoleError("Failed to create role, try again.");
    } finally {
      setAddingRole(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Loading users...
      </div>
    );

  return (
    <div className="p-6">
      {/* Users Section */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">User Settings</h2>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="flex items-center gap-2 bg-[#0C2B4E] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0a2340]"
        >
          <Plus size={16} />
          Add User
        </button>
      </div>

      {showForm && (
        <div className="mb-6 flex flex-wrap items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
          <input
            type="text"
            placeholder="Full Name"
            value={newFullName}
            onChange={(e) => {
              setFormError("");
              setNewFullName(e.target.value);
            }}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C2B4E]"
          />
          <input
            type="text"
            placeholder="Username"
            value={newUsername}
            onChange={(e) => {
              setFormError("");
              setNewUsername(e.target.value);
            }}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C2B4E]"
          />
          <input
            type="text"
            placeholder="email@example.com"
            value={newEmail}
            onChange={(e) => {
              setFormError("");
              setNewEmail(e.target.value);
            }}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C2B4E]"
          />
          <input
            type="password"
            placeholder="Password"
            value={newPassword}
            onChange={(e) => {
              setFormError("");
              setNewPassword(e.target.value);
            }}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C2B4E]"
          />
          <select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C2B4E]"
          >
            {roles.map((r) => (
              <option key={r.id} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleAdd}
            disabled={adding}
            className="bg-[#0C2B4E] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#0a2340]"
          >
            {adding ? "Adding..." : "Confirm"}
          </button>
          <button
            onClick={() => {
              setShowForm(false);
              setFormError("");
            }}
            className="text-gray-400 text-sm hover:text-gray-600"
          >
            Cancel
          </button>
          {formError && <p className="text-red-500 text-sm">{formError}</p>}
        </div>
      )}

      {users.length === 0 ? (
        <p className="text-gray-400">No users yet. Add one above.</p>
      ) : (
        <div className="grid grid-cols-4 gap-3">
          {users.map((user) => (
            <div key={user.id} className="bg-white rounded-xl p-4 shadow-sm">
              {editingId === user.id ? (
                <div className="flex flex-col gap-2 w-full">
                  <input
                    type="text"
                    value={editFullName}
                    onChange={(e) => {
                      setEditError("");
                      setEditFullName(e.target.value);
                    }}
                    placeholder="Full Name"
                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C2B4E]"
                  />
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => {
                      setEditError("");
                      setEditUsername(e.target.value);
                    }}
                    placeholder="Username"
                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C2B4E]"
                  />
                  <input
                    type="text"
                    value={editEmail}
                    onChange={(e) => {
                      setEditError("");
                      setEditEmail(e.target.value);
                    }}
                    placeholder="Email"
                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C2B4E]"
                  />
                  <input
                    type="password"
                    value={editPassword}
                    onChange={(e) => {
                      setEditError("");
                      setEditPassword(e.target.value);
                    }}
                    placeholder="New password (leave blank to keep)"
                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C2B4E]"
                  />
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C2B4E]"
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.name}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                  {editError && (
                    <p className="text-red-500 text-xs">{editError}</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleConfirmEdit(user.id)}
                      className="text-green-500 hover:text-green-700"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-gray-800">
                    {user.fullName}
                  </span>
                  <span className="text-sm text-gray-500">{user.username}</span>
                  <span className="text-sm text-gray-400">{user.email}</span>
                  <span className="text-xs font-medium text-[#0C2B4E] mt-1">
                    {user.roles.join(", ")}
                  </span>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-gray-400 hover:text-[#0C2B4E] transition-colors"
                    >
                      <Pencil size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Roles Section */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Roles</h2>
          <button
            onClick={() => setShowRoleForm((prev) => !prev)}
            className="flex items-center gap-2 bg-[#0C2B4E] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0a2340]"
          >
            <Plus size={16} />
            Add Role
          </button>
        </div>

        {showRoleForm && (
          <div className="mb-6 flex flex-wrap items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
            <input
              type="text"
              placeholder="Role name e.g. WAITER"
              value={newRoleName}
              onChange={(e) => {
                setRoleError("");
                setNewRoleName(e.target.value);
              }}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C2B4E]"
            />
            <button
              onClick={handleAddRole}
              disabled={addingRole}
              className="bg-[#0C2B4E] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#0a2340]"
            >
              {addingRole ? "Adding..." : "Confirm"}
            </button>
            <button
              onClick={() => {
                setShowRoleForm(false);
                setRoleError("");
              }}
              className="text-gray-400 text-sm hover:text-gray-600"
            >
              Cancel
            </button>
            {roleError && <p className="text-red-500 text-sm">{roleError}</p>}
          </div>
        )}

        <div className="grid grid-cols-4 gap-3">
          {roles.map((role) => (
            <div key={role.id} className="bg-white rounded-xl p-4 shadow-sm">
              <span className="font-medium text-[#0C2B4E]">{role.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
