import { useState, useEffect } from 'react';
import api from '../services/api';
import type { Member, MemberParams } from '../types/member';
import type { PaginatedResult } from '../types/pagination';


const DEFAULT_PARAMS: MemberParams = {
    minAge: 18,
    maxAge: 100,
    pageNumber: 1,
    pageSize: 5,
    orderBy: 'lastActive',
};

function getSavedParams(): MemberParams {
    const saved = localStorage.getItem('filters');
    return saved ? JSON.parse(saved) : DEFAULT_PARAMS;
}


export function useMembers() {
    const [paginatedMembers, setPaginatedMembers] = useState<PaginatedResult<Member> | null>(null);
    const [memberParams, setMemberParams] = useState<MemberParams>(getSavedParams);
    const [loading, setLoading] = useState(false);

    const loadMembers = async (params: MemberParams) => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                pageNumber: String(params.pageNumber),
                pageSize: String(params.pageSize),
                minAge: String(params.minAge),
                maxAge: String(params.maxAge),
                orderBy: params.orderBy,
                ...(params.gender && {gender: params.gender}),
            });

            const res = await api.get<PaginatedResult<Member>>(`members?${queryParams}`);
            setPaginatedMembers(res.data);
            localStorage.setItem('filters', JSON.stringify(params));

        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        loadMembers(memberParams);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const updateParams = (newParams: MemberParams) => {
        setMemberParams(newParams);
        loadMembers(newParams);
    };


    const resetParams = () => {
        setMemberParams(DEFAULT_PARAMS);
        loadMembers(DEFAULT_PARAMS);
    };


    const onPageChange = (pageNumber: number, pageSize: number) => {
        const updated = {...memberParams, pageNumber, pageSize};
        setMemberParams(updated);
        loadMembers(updated);
    };


    return {
        paginatedMembers,
        memberParams,
        loading, 
        updateParams,
        resetParams,
        onPageChange,
    };


}