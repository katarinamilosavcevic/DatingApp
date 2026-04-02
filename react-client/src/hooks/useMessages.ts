import { useState } from 'react';
import api from '../services/api';
import type { Message } from '../types/message';
import type { PaginatedResult } from '../types/pagination';

export function useMessages() {
  const [paginatedMessages, setPaginatedMessages] = useState<PaginatedResult<Message> | null>(null);
  const [loading, setLoading] = useState(false);

  const getMessages = async (container: string, pageNumber: number, pageSize: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        container,
        pageNumber: String(pageNumber),
        pageSize: String(pageSize),
      });
      const res = await api.get<PaginatedResult<Message>>(`messages?${params}`);
      setPaginatedMessages(res.data);
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id: string) => {
    await api.delete(`messages/${id}`);
    setPaginatedMessages(prev => {
      if (!prev) return null;
      return {
        ...prev,
        items: prev.items.filter(m => m.id !== id),
      };
    });
  };

  return { paginatedMessages, loading, getMessages, deleteMessage };
}