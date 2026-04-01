type Props = {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    onPageChange: (pageNumber: number, pageSize: number) => void;
};


const PAGE_SIZE_OPTIONS = [5, 10, 15, 20];


export default function Paginator({pageNumber, pageSize, totalCount, totalPages, onPageChange} : Props) {

    const firstItem = (pageNumber - 1) * pageSize + 1;
    const lastItem = Math.min(pageNumber*pageSize, totalCount);

    return (
        <div className="flex items-center gap-3 py-3">
            <span className="text-sm">Items per page:</span>
            <select value={pageSize} onChange={e => onPageChange(1, Number(e.target.value))} className="border rounded px-2 py-1 text-sm">
                {PAGE_SIZE_OPTIONS.map(size => (<option key={size} value={size}>{size}</option>))}
            </select>
            <span className="text-sm">{firstItem} - {lastItem} of {totalCount}</span>
            <div className="flex items-center gap-2">
                <button disabled={pageNumber === 1} onClick={() => onPageChange(pageNumber - 1, pageSize)} className="px-3 py-1 rounded border disabled:opacity-50 cursor-pointer hover:bg-gray-100">
                    ←
                </button>
                <button disabled={pageNumber >= totalPages} onClick={() => onPageChange(pageNumber + 1, pageSize)} className="px-3 py-1 rounded border disabled:opacity-50 cursor-pointer hover:bg-gray-100">
                    →
                </button>
            </div>
        </div>
    );

};