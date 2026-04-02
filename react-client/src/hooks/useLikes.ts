import { useState, useEffect } from 'react';
import api from '../services/api';
import type { Member } from '../types/member';
import type { PaginatedResult } from '../types/pagination';

export function useLikes() {
  const [likeIds, setLikeIds] = useState<string[]>([]);

  useEffect(() => {
    api.get<string[]>('likes/list')
      .then(res => setLikeIds(res.data))
      .catch(() => setLikeIds([]));
  }, []);

  const toggleLike = async (targetMemberId: string) => {
    await api.post(`likes/${targetMemberId}`, {});
    setLikeIds(prev => prev.includes(targetMemberId) ? prev.filter(id => id !== targetMemberId) : [...prev, targetMemberId] );
  };

  const getLikes = async (predicate: string, pageNumber: number, pageSize: number) => {
    const params = new URLSearchParams({
      predicate,
      pageNumber: String(pageNumber),
      pageSize: String(pageSize),
    });
    const res = await api.get<PaginatedResult<Member>>(`likes?${params}`);
    return res.data;
  };

  return { likeIds, toggleLike, getLikes };
}