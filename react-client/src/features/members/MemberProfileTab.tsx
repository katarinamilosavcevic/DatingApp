import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { Member, EditableMember } from '../../types/member';
import api from '../../services/api';
import { toast } from '../../services/toast';
import { useAuth } from '../../app/AuthContext';

type OutletContext = {
  member: Member;
  setMember: (member: Member) => void;
  editMode: boolean;
  setEditMode: (val: boolean) => void;
  setHasUnsavedChanges: (val: boolean) => void;
};



export default function MemberProfileTab() {
    const { member, setMember, editMode, setEditMode, setHasUnsavedChanges } = useOutletContext<OutletContext>();
    const { currentUser, setCurrentUser } = useAuth();

    const [editableMember, setEditableMember] = useState<EditableMember>({
        displayName: member.displayName,
        description: member.description || '',
        city: member.city,
        country: member.country,
    });
    const [isDirty, setIsDirty] = useState(false);


    useEffect(() => {
        if (!editMode) {
            setEditableMember({
            displayName: member.displayName,
            description: member.description || '',
            city: member.city,
            country: member.country,
            });
            setIsDirty(false);
        }
    }, [editMode, member]);

    const handleChange = (field: keyof EditableMember, value: string) => {
        setEditableMember((prev: EditableMember) => ({ ...prev, [field]: value }));
        setIsDirty(true);
        setHasUnsavedChanges(true);
    };

    const updateProfile = async () => {
        await api.put('members', editableMember);
        const updatedMember = { ...member, ...editableMember };
        setMember(updatedMember);

        if (currentUser && editableMember.displayName !== currentUser.displayName) {
            setCurrentUser({ ...currentUser, displayName: editableMember.displayName });
        }

        toast.success('Profile updated successfully');
        setEditMode(false);
        setIsDirty(false);
        setHasUnsavedChanges(false);
    };

    const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });


    return (
        <div className="flex flex-col gap-3">
            

            {editMode ? (
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Display name</label>
                        <input value={editableMember.displayName}
                            onChange={e => handleChange('displayName', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea value={editableMember.description}
                            onChange={e => handleChange('description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none" rows={4} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input value={editableMember.city}
                            onChange={e => handleChange('city', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                        <input value={editableMember.country}
                            onChange={e => handleChange('country', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none" />
                    </div>
                    <div className="flex justify-end">
                        <button onClick={updateProfile} disabled={!isDirty}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 cursor-pointer">
                            Submit
                        </button>
                    </div>
                </div>
            )
                : (
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-3">
                            <span className="font-semibold">Member since:</span>
                            <span>{formatDate(member.created)}</span>
                        </div>
                        <div className="flex gap-3">
                            <span className="font-semibold">Last active:</span>
                            <span>{formatDate(member.lastActive)}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-purple-600">About {member.displayName}</h3>
                        <div>{member.description || 'No description provided yet'}</div>
                    </div>
                )}
        </div>
    );


}