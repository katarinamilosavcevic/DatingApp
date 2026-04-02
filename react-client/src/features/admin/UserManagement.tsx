import { useState, useEffect } from 'react';
import api from '../../services/api';
import type { User } from '../../types/user';

const AVAILABLE_ROLES = ['Member', 'Moderator', 'Admin'];

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  useEffect(() => {
    api.get<User[]>('admin/users-with-roles')
      .then(res => setUsers(res.data));
  }, []);

  const openModal = (user: User) => {
    setSelectedUser(user);
    setSelectedRoles([...user.roles]);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setSelectedRoles([]);
  };

  const toggleRole = (role: string) => {
    setSelectedRoles(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const updateRoles = async () => {
    if (!selectedUser) return;
    const res = await api.post<string[]>(
      `admin/edit-roles/${selectedUser.id}?roles=${selectedRoles}`, {}
    );
    setUsers(prev => prev.map(u =>
      u.id === selectedUser.id ? { ...u, roles: res.data } : u
    ));
    closeModal();
  };

  return (
    <div className="h-[75vh] overflow-auto rounded-lg border bg-white">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="text-left px-4 py-3">Email</th>
            <th className="text-left px-4 py-3">Active roles</th>
            <th className="text-left px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3">{user.email}</td>
              <td className="px-4 py-3">{user.roles?.join(', ')}</td>
              <td className="px-4 py-3">
                <button onClick={() => openModal(user)}
                  className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer">
                  Edit roles
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Edit roles for {selectedUser.email}</h3>

            <div className="border rounded-lg p-4 flex flex-col gap-3">
              <legend className="text-sm font-medium text-gray-700 mb-2">Select roles</legend>
              {AVAILABLE_ROLES.map(role => (
                <label key={role} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox"
                    checked={selectedRoles.includes(role)}
                    disabled={selectedUser.email === 'admin@test.com' && role === 'Admin'}
                    onChange={() => toggleRole(role)}
                    className="w-4 h-4" />
                  <span>{role}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={closeModal}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 cursor-pointer">
                Cancel
              </button>
              <button onClick={updateRoles}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer">
                Submit
              </button>
            </div>
          </div>
          <div className="absolute inset-0 -z-10" onClick={closeModal} />
        </div>
      )}
    </div>
  );
}