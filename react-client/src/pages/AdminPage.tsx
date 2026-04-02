import { useState } from 'react';
import { useAuth } from '../app/AuthContext';
import UserManagement from '../features/admin/UserManagement';
import PhotoManagement from '../features/admin/PhotoManagement';

const TABS = [
  { label: 'Photo moderation', value: 'photos' },
  { label: 'User management', value: 'roles' },
];

export default function AdminPage() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('photos');
  const isAdmin = currentUser?.roles?.includes('Admin');

  return (
    <div className="flex flex-col w-full">
      <div className="flex gap-2 mb-4">
        {TABS.map(tab => (
          tab.value === 'roles' && !isAdmin ? null : (
            <button key={tab.value} onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2 rounded-lg text-lg cursor-pointer border
                ${activeTab === tab.value
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-white text-purple-600 border-purple-600 hover:bg-purple-50'}`}>
              {tab.label}
            </button>
          )
        ))}
      </div>

      {activeTab === 'roles' && <UserManagement />}
      {activeTab === 'photos' && <PhotoManagement />}
    </div>
  );
}