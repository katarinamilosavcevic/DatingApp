import { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from '../../services/toast';
import type { Report } from '../../types/report';
import { ReasonLabels } from '../../types/report';

export default function ReportManagement() {
    const [reports, setReports] = useState<Report[]>([]);

    const loadReports = async () => {
        const res = await api.get<Report[]>('report');
        setReports(res.data);
    };

    useEffect(() => {
        loadReports();
    }, []);

    const handleResolve = async (id: number) => {
        await api.put(`report/${id}/resolve`);
        toast.success('Report resolved');
        setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'Resolved' } : r));
    };

    return (
        <div className="h-[75vh] overflow-auto rounded-lg border bg-white">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4">Reporter</th>
                        <th className="text-left py-3 px-4">Reported</th>
                        <th className="text-left py-3 px-4">Reason</th>
                        <th className="text-left py-3 px-4">Description</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.map(report => (
                        <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">{report.reporter?.displayName}</td>
                            <td className="py-3 px-4">{report.reportedUser?.displayName}</td>
                            <td className="py-3 px-4">{ReasonLabels[report.reason]}</td>
                            <td className="py-3 px-4 text-gray-500 text-sm">{report.description || '—'}</td>
                            <td className="py-3 px-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium
                                ${report.status === 'Pending'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-green-100 text-green-800'}`}>
                                    {report.status}
                                </span>
                            </td>
                            <td className="py-3 px-4">
                                {report.status === 'Pending' && (
                                    <button onClick={() => handleResolve(report.id)}
                                        className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer text-sm">
                                        Resolve
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}