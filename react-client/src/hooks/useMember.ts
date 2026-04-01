import { useEffect, useState } from "react";
import type { Member } from "../types/member";
import api from "../services/api";


export function useMember(id: string) {
    const [member, setMember] = useState<Member | null> (null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get<Member>(`members/${id}`)
            .then(res => setMember(res.data))
            .catch(() => setMember(null))
            .finally(() => setLoading(false));
    }, [id]);

    return {member, setMember, loading};
}