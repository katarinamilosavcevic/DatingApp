import { useState, useEffect } from 'react';
import { useLikes } from '../hooks/useLikes';
import MemberCard from '../features/members/MemberCard';
import Paginator from '../shared/Paginator';
import type { Member } from '../types/member';
import type { PaginatedResult } from '../types/pagination';
import { useBlocking } from '../hooks/useBlocking';

const TABS = [
  { label: 'Liked', value: 'liked' },
  { label: 'Liked me', value: 'likedBy' },
  { label: 'Mutual', value: 'mutual' },
  { label: 'Blocked', value: 'blocked' },
];

export default function ListsPage() {
  const { getLikes } = useLikes();
  const { getBlockedMembers, unblockUser } = useBlocking();
  const [predicate, setPredicate] = useState('liked');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [paginatedResult, setPaginatedResult] = useState<PaginatedResult<Member> | null>(null);
  

  useEffect(() => {
    if (predicate === 'blocked') {
      loadBlocked();
    } else {
      loadLikes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [predicate, pageNumber, pageSize]);

  const loadLikes = async () => {
    const result = await getLikes(predicate, pageNumber, pageSize);
    setPaginatedResult(result);
  };

  const loadBlocked = async () => {
    const result = await getBlockedMembers(pageNumber, pageSize);
    setPaginatedResult(result);
  };

  const handleUnblock = async (memberId: string) => {
    const success = await unblockUser(memberId);
    if (success) loadBlocked();
  };

  const setPred = (value: string) => {
    if (predicate !== value) {
      setPredicate(value);
      setPageNumber(1);
    }
  };

  const onPageChange = (page: number, size: number) => {
    setPageNumber(page);
    setPageSize(size);
  };

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {TABS.map(tab => (
            <button key={tab.value} onClick={() => setPred(tab.value)}
              className={`px-4 py-2 rounded-lg text-lg cursor-pointer border
                ${predicate === tab.value
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-white text-purple-600 border-purple-600 hover:bg-purple-50'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {paginatedResult && paginatedResult.metadata.totalCount > 0 && (
          <Paginator
            pageNumber={paginatedResult.metadata.currentPage}
            pageSize={paginatedResult.metadata.pageSize}
            totalCount={paginatedResult.metadata.totalCount}
            totalPages={paginatedResult.metadata.totalPages}
            onPageChange={onPageChange}
          />
        )}
      </div>

     {paginatedResult?.items.length === 0 ? (
        <p className="text-lg text-gray-500 mt-3">
          {predicate === 'blocked' ? 'You have not blocked anyone.' : 'There are no results for this filter.'}
        </p>
      ) : (
        <div className="grid grid-cols-5 gap-6 mt-3">
          {paginatedResult?.items.map(member => (
            <div key={member.id} className="flex flex-col gap-2">
              <MemberCard
                member={member}
                disableNavigation={predicate === 'blocked'}
                hideHeart={predicate === 'blocked'}
              />
              {predicate === 'blocked' && (
                <button
                  onClick={() => handleUnblock(member.id)}
                  className="w-full px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer text-sm">
                  Unblock
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}