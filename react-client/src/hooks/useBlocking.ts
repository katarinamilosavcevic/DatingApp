import { useState } from 'react';
import api from '../services/api';
import { toast } from '../services/toast';
import type { Member } from '../types/member';
import type { PaginatedResult } from '../types/pagination';

export const ReportReasons = [
    { value: 0, label: 'Spam' },
    { value: 1, label: 'Harassment' },
    { value: 2, label: 'Inappropriate Content' },
    { value: 3, label: 'Fake Profile' },
    { value: 4, label: 'Other' },
];

export function useBlocking() {

    const [loading, setLoading] = useState(false);


    const blockUser = async (targetMemberId: string) => {
        setLoading(true);
        try {
            await api.post(`blocking/${targetMemberId}`);
            toast.success('User blocked successfully');
            return true;
        } catch {
            toast.error('Failed to block user');
            return false;
        } finally {
            setLoading(false);
        }
    };



    const unblockUser = async (targetMemberId: string) => {
        setLoading(true);
        try {
            await api.delete(`blocking/${targetMemberId}`);
            toast.success('User unblocked successfully');
            return true;
        } catch {
            toast.error('Failed to unblock user');
            return false;
        } finally {
            setLoading(false);
        }
    };



    const reportUser = async (targetMemberId: string, reason: number, description: string) => {
        setLoading(true);
        try {
            await api.post(`report/${targetMemberId}`, { reason, description });
            toast.success('User reported successfully');
            return true;
        } catch {
            toast.error('Failed to report user');
            return false;
        } finally {
            setLoading(false);
        }
    };



    const getBlockedMembers = async (pageNumber: number, pageSize: number): Promise<PaginatedResult<Member> | null> => {
        try {
            const res = await api.get<PaginatedResult<Member>>('blocking', {
                params: { pageNumber, pageSize }
            });
            return res.data;
        } catch {
            return null;
        }
    };

    return { blockUser, unblockUser, reportUser, getBlockedMembers, loading };


}