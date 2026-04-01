import { useOutletContext } from 'react-router-dom';
import type { Member } from '../../types/member';

type OutletContext = {
  member: Member;
  editMode: boolean;
};


export default function MemberProfileTab() {
    const {member, editMode} = useOutletContext<OutletContext>();

    const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });


    return (
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

            {editMode ? (<p className="text-gray-400">...</p>) : (<div>{member.description || 'No description provided yet'}</div>)}
        </div>
    );

    
}