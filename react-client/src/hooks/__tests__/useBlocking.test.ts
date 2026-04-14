import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useBlocking } from '../useBlocking';

vi.mock('../../services/api', () => ({
    default: { post: vi.fn(), delete: vi.fn(), get: vi.fn() }
}));

vi.mock('../../services/toast', () => ({
    toast: { success: vi.fn(), error: vi.fn() }
}));

import api from '../../services/api';
import { toast } from '../../services/toast';

describe('useBlocking', () => {
    beforeEach(() => vi.clearAllMocks());

    it('blockUser calls correct endpoint and returns true', async () => {
        vi.mocked(api.post).mockResolvedValue({ data: {} });
        const { result } = renderHook(() => useBlocking());

        let success = false;
        await act(async () => { success = await result.current.blockUser('user-2'); });

        expect(api.post).toHaveBeenCalledWith('blocking/user-2');
        expect(success).toBe(true);
        expect(toast.success).toHaveBeenCalledWith('User blocked successfully');
    });

    it('blockUser returns false and shows error on API failure', async () => {
        vi.mocked(api.post).mockRejectedValue(new Error('Network error'));
        const { result } = renderHook(() => useBlocking());

        let success = true;
        await act(async () => { success = await result.current.blockUser('user-2'); });

        expect(success).toBe(false);
        expect(toast.error).toHaveBeenCalledWith('Failed to block user');
    });

    it('reportUser calls endpoint with correct reason and description', async () => {
        vi.mocked(api.post).mockResolvedValue({ data: {} });
        const { result } = renderHook(() => useBlocking());

        await act(async () => { await result.current.reportUser('user-2', 1, 'Spam content'); });

        expect(api.post).toHaveBeenCalledWith('report/user-2', { reason: 1, description: 'Spam content' });
        expect(toast.success).toHaveBeenCalledWith('User reported successfully');
    });

    it('reportUser returns false on failure', async () => {
        vi.mocked(api.post).mockRejectedValue(new Error('Server error'));
        const { result } = renderHook(() => useBlocking());

        let success = true;
        await act(async () => { success = await result.current.reportUser('user-2', 0, ''); });

        expect(success).toBe(false);
        expect(toast.error).toHaveBeenCalledWith('Failed to report user');
    });

    it('unblockUser calls DELETE endpoint and returns true', async () => {
        vi.mocked(api.delete).mockResolvedValue({ data: {} });
        const { result } = renderHook(() => useBlocking());

        let success = false;
        await act(async () => { success = await result.current.unblockUser('user-2'); });

        expect(api.delete).toHaveBeenCalledWith('blocking/user-2');
        expect(success).toBe(true);
        expect(toast.success).toHaveBeenCalledWith('User unblocked successfully');
    });

    it('unblockUser returns false on failure', async () => {
        vi.mocked(api.delete).mockRejectedValue(new Error('Failed'));
        const { result } = renderHook(() => useBlocking());

        let success = true;
        await act(async () => { success = await result.current.unblockUser('user-2'); });

        expect(success).toBe(false);
        expect(toast.error).toHaveBeenCalledWith('Failed to unblock user');
    });

    it('loading is true during call and false after', async () => {
        let resolve!: () => void;
        vi.mocked(api.post).mockReturnValue(new Promise(r => { resolve = () => r({ data: {} }); }));

        const { result } = renderHook(() => useBlocking());
        expect(result.current.loading).toBe(false);

        let p: Promise<boolean>;
        act(() => { p = result.current.blockUser('user-2'); });
        expect(result.current.loading).toBe(true);

        await act(async () => { resolve(); await p; });
        expect(result.current.loading).toBe(false);
    });
});