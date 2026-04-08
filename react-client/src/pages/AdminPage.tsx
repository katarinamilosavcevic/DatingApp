import { useState } from 'react';
import { useAuth } from '../app/AuthContext';
import UserManagement from '../features/admin/UserManagement';
import PhotoManagement from '../features/admin/PhotoManagement';
import ReportManagement from '../features/admin/ReportManagement';

const TABS = [
  { label: 'Photo moderation', value: 'photos', adminOnly: false },
  { label: 'User management', value: 'roles', adminOnly: true },
  { label: 'Reports', value: 'reports', adminOnly: true },
];

export default function AdminPage() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('photos');
  const isAdmin = currentUser?.roles?.includes('Admin');

  return (
    <div className="flex flex-col w-full">
      <div className="flex gap-2 mb-4">
        {TABS.map(tab => (
          tab.adminOnly && !isAdmin ? null : (
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
      {activeTab === 'reports' && <ReportManagement />}
    </div>
  );
}