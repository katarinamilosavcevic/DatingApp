import { useNavigate } from "react-router-dom";
import type { Member } from "../../types/member"
import { calculateAge } from "../../utils/age";
import { useLikes } from "../../hooks/useLikes";
import HeartButton from "../../shared/HeartButton"
import { usePresence } from "../../app/PresenceContext";

type Props = {
    member: Member;
    disableNavigation?: boolean;
    hideHeart?: boolean;
};


export default function MemberCard({ member, disableNavigation, hideHeart }: Props) {
    const navigate = useNavigate();
    const { likeIds, toggleLike } = useLikes();
    const { onlineUsers } = usePresence();
    const hasLiked = likeIds.includes(member.id);
    const isOnline = onlineUsers.includes(member.id);

    const handleLike = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleLike(member.id);
    };

    const handleClick = () => {
        if (!disableNavigation) navigate(`/members/${member.id}`);
    };

    return (
        <div onClick={handleClick} className="rounded-lg overflow-hidden shadow-md hover:-translate-y-2 transition-transform duration-300 relative ${disableNavigation ? '' : 'cursor-pointer'}">
            <img src={member.imageUrl || '/user.png'} alt={member.displayName} className="w-full h-64 object-cover" />
            {isOnline && (
                <span className="absolute top-3 left-3 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
            )}
            {!hideHeart && <HeartButton selected={hasLiked} onClick={handleLike} />}
            <div className="absolute bottom-0 w-full px-3 py-2 rounded-b-lg" style={{ background: 'linear-gradient(to top, black, rgba(0,0,0,0.75), transparent)' }}>
                <div className="flex flex-col text-white">
                    <span className="font-semibold">{member.displayName}, {calculateAge(member.dateOfBirth)}</span>
                    <span className="text-sm">{member.city}</span>
                </div>
            </div>
        </div>
    );

}