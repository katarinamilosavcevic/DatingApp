import { useOutletContext } from "react-router-dom";
import type { Photo, Member } from "../../types/member";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../app/AuthContext";


type OutletContext = {
    member: Member;
    setMember: (member: Member) => void;
    editMode: boolean;
};


export default function MemberPhotosTab() {

    const { member, setMember, editMode } = useOutletContext<OutletContext>();
    const { currentUser, setCurrentUser } = useAuth();
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [uploadLoading, setUploadLoading] = useState(false);


    useEffect(() => {
        api.get<Photo[]>(`members/${member.id}/photos`)
            .then(res => setPhotos(res.data));
    }, [member.id]);

    const handleUpload = async (file: File) => {
        setUploadLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        const res = await api.post<Photo>('members/add-photo', formData);
        const newPhoto = res.data;
        setPhotos(prev => [...prev, newPhoto]);
        if (!member.imageUrl) {
            setMainLocalPhoto(newPhoto);
        }
        setUploadLoading(false);
    };

    const setMainPhoto = async (photo: Photo) => {
        await api.put(`members/set-main-photo/${photo.id}`, {});
        setMainLocalPhoto(photo);
    };

    const setMainLocalPhoto = (photo: Photo) => {
        if (currentUser) setCurrentUser({ ...currentUser, imageUrl: photo.url });
        setMember({ ...member, imageUrl: photo.url });
    };

    const deletePhoto = async (photoId: number) => {
        await api.delete(`members/delete-photo/${photoId}`);
        setPhotos(prev => prev.filter(p => p.id !== photoId));
    };

    if (editMode) {
        return <ImageUploadDropzone onUpload={handleUpload} loading={uploadLoading} />;
    }


    return (
        <div className="grid grid-cols-4 gap-3 p-5 max-h-[65vh] overflow-auto">
            {photos.length === 0 ? (
                <p className="text-gray-500 col-span-4 text-center">No photos available</p>
            ) : (
                photos.map(photo => (
                    <div key={photo.id} className="relative">
                        <img src={photo.url} alt="member photo"
                            className={`w-full rounded-lg ${!photo.isApproved ? 'opacity-30' : ''}`} />

                        {!photo.isApproved && (
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                Awaiting approval
                            </div>
                        )}

                        {currentUser?.id === member.id && (
                            <>
                                <button
                                    disabled={photo.url === member.imageUrl || !photo.isApproved}
                                    onClick={() => setMainPhoto(photo)}
                                    className={`absolute top-1 right-1 rounded-full w-7 h-7 flex items-center justify-center disabled:opacity-30 cursor-pointer
    ${photo.url === member.imageUrl ? 'bg-yellow-400 text-white' : 'bg-white text-gray-400'}`}>
                                    ★
                                </button>
                                <button
                                    disabled={photo.url === member.imageUrl}
                                    onClick={() => deletePhoto(photo.id)}
                                    className="absolute top-1 left-1 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center disabled:opacity-30 cursor-pointer">
                                    ✕
                                </button>
                            </>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}

function ImageUploadDropzone({ onUpload, loading }: { onUpload: (file: File) => void; loading: boolean }) {
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);

    const handleFile = (f: File) => {
        setFile(f);
        const reader = new FileReader();
        reader.onload = e => setPreview(e.target?.result as string);
        reader.readAsDataURL(f);
    };

    return (
        <div className="flex w-full gap-6 min-h-40">
            <label
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={e => { e.preventDefault(); setIsDragging(false); }}
                onDrop={e => {
                    e.preventDefault(); setIsDragging(false);
                    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
                }}
                htmlFor="dropzone-file"
                className={`flex flex-col items-center justify-center w-2/3 border-2 border-dashed rounded-lg cursor-pointer  ${isDragging ? 'border-purple-600 bg-purple-50 border-4' : 'border-gray-300'}`}>
                <p className="text-lg">Click to upload or drag and drop</p>
                <input type="file" id="dropzone-file" className="hidden"  onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
            </label>

            {preview && (
                <div className="flex flex-col w-1/3 gap-3">
                    <div className="flex justify-center border-2 border-gray-300 rounded-lg">
                        <img src={preview} alt="preview" className="object-cover rounded-lg aspect-square" />
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => { setPreview(null); setFile(null); }}
                            className="flex-1 px-3 py-2 border rounded-lg cursor-pointer hover:bg-gray-100">
                            Cancel
                        </button>
                        <button onClick={() => file && onUpload(file)} disabled={loading}
                            className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 cursor-pointer">
                            {loading ? '...' : 'Upload image'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}