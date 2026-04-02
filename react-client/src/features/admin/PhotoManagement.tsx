import { useState, useEffect } from 'react';
import api from '../../services/api';
import type { Photo } from '../../types/member';

export default function PhotoManagement() {
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    api.get<Photo[]>('admin/photos-to-moderate')
      .then(res => setPhotos(res.data));
  }, []);

  const approvePhoto = async (photoId: number) => {
    await api.post(`admin/approve-photo/${photoId}`, {});
    setPhotos(prev => prev.filter(p => p.id !== photoId));
  };

  const rejectPhoto = async (photoId: number) => {
    await api.post(`admin/reject-photo/${photoId}`, {});
    setPhotos(prev => prev.filter(p => p.id !== photoId));
  };

  return (
    <div className="grid grid-cols-6 gap-4">
      {photos.length === 0 ? (
        <p className="col-span-6 text-center text-gray-500 mt-4">No photos to moderate.</p>
      ) : (
        photos.map(photo => (
          <div key={photo.id}>
            <img src={photo.url} alt="user photo"
              className="w-full rounded-lg border p-1 object-cover" />
            <div className="flex gap-2 mt-2">
              <button onClick={() => approvePhoto(photo.id)}
                className="flex-1 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer text-sm">
                Approve
              </button>
              <button onClick={() => rejectPhoto(photo.id)}
                className="flex-1 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer text-sm">
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}