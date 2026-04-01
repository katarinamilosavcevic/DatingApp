import { useOutletContext } from "react-router-dom";
import type { Photo, Member } from "../../types/member";
import { useEffect, useState } from "react";
import api from "../../services/api";


type OutletContext = {
  member: Member;
  editMode: boolean;
};


export default function MemberPhotosTab() {

    const {member, editMode} = useOutletContext<OutletContext>();
    const [photos, setPhotos] = useState<Photo[]>([]);
 

    useEffect(() => {
        api.get<Photo[]>(`members/${member.id}/photos`)
            .then(res => setPhotos(res.data));
    }, [member.id]);


    if (editMode) return <p className="text-gray-400">Upload ...</p>;


    return (
        <div className="grid grid-cols-4 gap-3 p-5 max-h-[65vh] overflow-auto">
            {photos.length === 0 ? 
                (<p className="text-gray-500 col-span-4 text-center">No photos available</p>) 
                : (photos.map(photo => (
                    <div key={photo.id} className="relative">
                        <img src={photo.url} alt="member photo" className={`w-full rounded-lg ${!photo.isApproved ? 'opacity-30' : ''}`} />
                        {!photo.isApproved && (
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                Awaiting approval
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );


}

