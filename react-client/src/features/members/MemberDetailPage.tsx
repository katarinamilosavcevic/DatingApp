import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import { useMember } from "../../hooks/useMember";
import { useAuth } from "../../app/AuthContext";
import { useState } from "react";
import { calculateAge } from "../../utils/age";


export default function MemberDetailPage() {
    const {id} = useParams<{id: string}>();
    const {member, loading} = useMember(id!);
    const {currentUser} = useAuth();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState(false);

    const isCurrentUser = currentUser?.id === member?.id;

    if (loading) return <p>Loading...</p>;
    if (!member) return <p>Member not found</p>;

    return (
        <div className="flex gap-6">
            <div className="flex flex-col w-1/4 bg-white rounded-lg shadow p-4">
                <img src={member.imageUrl || '/user.png'} alt={member.displayName} className="rounded-full mx-auto mt-3 object-cover w-64 h-64" />
                <div className="flex flex-col items-center mt-4">
                    <div className="flex text-2xl text-purple-600 items-center gap-2">
                        {member.displayName}, {calculateAge(member.dateOfBirth)}
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
                    <button className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer">
                        Like user
                    </button>
                </div>
            </div>

            <div className="flex flex-col w-3/4 bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                    {isCurrentUser && (
                        <button onClick={() => setEditMode(!editMode)} className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 cursor-pointer ml-auto">
                            {editMode ? 'Cancel' : 'Edit'}
                        </button>
                    )}
                </div>

                <hr className="mb-4" />
                <Outlet context={{ member, setMember: () => {}, editMode, setEditMode }} />
            </div>
        </div>
    );

}