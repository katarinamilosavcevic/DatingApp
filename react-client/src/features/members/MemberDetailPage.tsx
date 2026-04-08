import { NavLink, Outlet, useBlocker, useNavigate, useParams } from "react-router-dom";
import { useMember } from "../../hooks/useMember";
import { useAuth } from "../../app/AuthContext";
import { useEffect, useState } from "react";
import { calculateAge } from "../../utils/age";
import { useLikes } from "../../hooks/useLikes";
import { usePresence } from "../../app/PresenceContext";
import { useBlocking, ReportReasons } from '../../hooks/useBlocking';
import Swal from 'sweetalert2';


export default function MemberDetailPage() {
    const {id} = useParams<{id: string}>();
    const {member, setMember, loading} = useMember(id!);
    const {currentUser} = useAuth();
     const { likeIds, toggleLike } = useLikes();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const { onlineUsers } = usePresence();
    const { blockUser, reportUser } = useBlocking();


    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) e.preventDefault();
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedChanges]);


    useBlocker(() => {
        if (editMode && hasUnsavedChanges) {
            return !confirm('Are you sure you want to continue? All unsaved changes will be lost.');
        }
        return false;
    });


    if (loading) return <p>Loading...</p>;
    if (!member) return <p>Member not found</p>;

    const isOnline = onlineUsers.includes(member.id);
    const isCurrentUser = currentUser?.id === member?.id;
    const hasLiked = likeIds.includes(id!);


    const handleBlock = async () => {
        const result = await Swal.fire({
            title: 'Block user?',
            text: `Are you sure you want to block ${member.displayName}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            confirmButtonText: 'Block'
        });
        if (result.isConfirmed) {
            const success = await blockUser(member.id);
            if (success) navigate('/members');
        }
    };

    const handleReport = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Report user',
            html: `
                <div style="text-align:left; padding: 0 16px">
                    <label for="swal-reason" style="display:block; margin-bottom:4px; font-weight:500">Reason:</label>
                    <select id="swal-reason" class="swal2-input" style="margin: 0; width:100%">
                        ${ReportReasons.map(r => `<option value="${r.value}">${r.label}</option>`).join('')}
                    </select>
                    <label for="swal-description" style="display:block; margin-bottom:4px; margin-top:12px; font-weight:500">Description:</label>
                    <textarea id="swal-description" class="swal2-textarea" placeholder="Optional" style="margin: 0; width:100%"></textarea>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Report',
            confirmButtonColor: '#d97706',
            preConfirm: () => {
                return {
                    reason: parseInt((document.getElementById('swal-reason') as HTMLSelectElement).value),
                    description: (document.getElementById('swal-description') as HTMLTextAreaElement).value
                };
            }
        });
        if (formValues) {
            await reportUser(member.id, formValues.reason, formValues.description);
        }
    };


    const handleTabChange = () => {
        if (hasUnsavedChanges) {
            const ok = confirm('Are you sure you want to continue? All unsaved changes will be lost.');
            if (!ok) return false;
            setHasUnsavedChanges(false);
        }
        setEditMode(false);
        return true;
    };

    return (
        <div className="flex gap-6">
            <div className="flex flex-col w-1/4 bg-white rounded-lg shadow p-4">
                <img src={member.imageUrl || '/user.png'} alt={member.displayName} className="rounded-full mx-auto mt-3 object-cover w-64 h-64" />
                <div className="flex flex-col items-center mt-4">
                    <div className="flex text-2xl text-purple-600 items-center gap-2">
                        {member.displayName}, {calculateAge(member.dateOfBirth)}
                        {isOnline && (
                            <span className="w-3 h-3 bg-green-500 rounded-full inline-block" />
                        )}
                    </div>
                    <div className="text-sm text-gray-500">
                        {member.city}, {member.country}
                    </div>
                </div>

                <hr className="my-4"/>
                <ul className="flex flex-col gap-1 text-xl">
                    <li>
                        <NavLink to="profile" 
                            className={({isActive}) => `block px-3 py-2 rounded hover:bg-gray-100 ${isActive ? 'text-purple-600' : ''}`}>
                                Profile
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="photos" 
                            className={({ isActive }) => `block px-3 py-2 rounded hover:bg-gray-100 ${isActive ? 'text-purple-600' : ''}`}>
                                Photos
                        </NavLink>
                    </li>
                    {!isCurrentUser && (
                    <li>
                        <NavLink to="messages" 
                            className={({ isActive }) => `block px-3 py-2 rounded hover:bg-gray-100 ${isActive ? 'text-purple-600' : ''}`}>
                                Messages
                        </NavLink>
                    </li>
                    )}
                </ul>

                <div className="flex gap-2 mt-auto pt-4">
                    <button onClick={() => navigate('/members')} className="flex-1 px-3 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 cursor-pointer">
                        Go back
                    </button>
                    {!isCurrentUser && (
                        <button onClick={() => toggleLike(member.id)} className={`flex-1 px-3 py-2 rounded-lg cursor-pointer text-white ${hasLiked ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}>
                            {hasLiked ? 'Remove like' : 'Like user'}
                        </button>
                    )}
                </div>
            </div>

            <div className="flex flex-col w-3/4 bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                    {!isCurrentUser && (
                        <div className="flex gap-2">
                            <button onClick={handleBlock}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer">
                                Block user
                            </button>
                            <button onClick={handleReport}
                                className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 cursor-pointer">
                                Report user
                            </button>
                        </div>
                    )}
                    {isCurrentUser && (
                        <button onClick={() => editMode ? handleTabChange() : setEditMode(true)} className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 cursor-pointer ml-auto">
                            {editMode ? 'Cancel' : 'Edit'}
                        </button>
                    )}
                </div>

                <hr className="mb-4" />
                <Outlet context={{ member, setMember, editMode, setEditMode, setHasUnsavedChanges}} />
            </div>
        </div>
    );

}