import { useState } from "react";
import { useMembers } from "../../hooks/useMembers";
import Paginator from "../../shared/Paginator";
import MemberCard from "./MemberCard";
import FilterPanel from "./FilterPanel";


export default function MemberListPage(){
    const {paginatedMembers, memberParams, loading, updateParams, resetParams, onPageChange} = useMembers();
    const [showFilters, setShowFilters] = useState(false);

    const getDisplayMessage = () => {
        const filters: string[] = [];

        if (memberParams.gender){
            filters.push(memberParams.gender + 's');
        }else {
            filters.push('Males, Females');
        }

        if (memberParams.minAge !== 18 && memberParams.maxAge !== 100) {
            filters.push(`ages ${memberParams.maxAge}-${memberParams.maxAge}`);
        }

        filters.push(memberParams.orderBy === 'lastActive' ? 'Recently active' : 'Newest members');

        return `Selected: ${filters.join(' | ')}`;
    };


    if (loading) return <p>Loading...</p>


    return (
        <div className="flex flex-col w-full gap-4">
            <div className="flex justify-between items-center">
                <div className="flex gap-3 items-center">
                    <button onClick={() => setShowFilters(true)} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer">
                        Select filters
                    </button>
                    <button onClick={resetParams} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 cursor-pointer">
                        Reset filters
                    </button>
                    <div className="text-purple-600 border rounded-lg px-4 py-2 capitalize">
                        {getDisplayMessage()}
                    </div>
                </div>

                {paginatedMembers && (
                    <Paginator 
                        pageNumber={paginatedMembers.metadata.currentPage}
                        pageSize={paginatedMembers.metadata.pageSize} 
                        totalCount={paginatedMembers.metadata.totalCount}
                        totalPages={paginatedMembers.metadata.totalPages}
                        onPageChange={onPageChange}
                    />
                )}
            </div>

            {paginatedMembers && (
                <div className="grid grid-cols-5 gap-6">
                    {paginatedMembers.items.map(member => (<MemberCard key={member.id} member={member} />))}
                </div>
            )}

            {showFilters && (
                <FilterPanel 
                    memberParams={memberParams} 
                    onSubmit={(params) => {updateParams(params); setShowFilters(false);}} 
                    onClose= {() => setShowFilters(false)}
                />
            )}
        </div>
    );


    

}