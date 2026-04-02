import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMessages } from '../hooks/useMessages';
import Paginator from '../shared/Paginator';
import DeleteButton from '../shared/DeleteButton';

const TABS = [
  { label: 'Inbox', value: 'Inbox' },
  { label: 'Outbox', value: 'Outbox' },
];

export default function MessagesPage() {
  const { paginatedMessages, loading, getMessages, deleteMessage } = useMessages();
  const [container, setContainer] = useState('Inbox');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  const isInbox = container === 'Inbox';

  useEffect(() => {
    getMessages(container, pageNumber, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [container, pageNumber, pageSize]);

  const setTab = (value: string) => {
    if (container !== value) {
      setContainer(value);
      setPageNumber(1);
    }
  };

  const onPageChange = (page: number, size: number) => {
    setPageNumber(page);
    setPageSize(size);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const ok = confirm('Are you sure you want to delete this message?');
    if (ok) await deleteMessage(id);
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {TABS.map(tab => (
            <button key={tab.value} onClick={() => setTab(tab.value)}
              className={`px-4 py-2 rounded-lg text-lg cursor-pointer border
                ${container === tab.value
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-white text-purple-600 border-purple-600 hover:bg-purple-50'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {paginatedMessages && paginatedMessages.metadata.totalCount > 0 && (
          <Paginator
            pageNumber={paginatedMessages.metadata.currentPage}
            pageSize={paginatedMessages.metadata.pageSize}
            totalCount={paginatedMessages.metadata.totalCount}
            totalPages={paginatedMessages.metadata.totalPages}
            onPageChange={onPageChange}
          />
        )}
      </div>

      {loading ? (
        <p className="mt-4">Učitavanje...</p>
      ) : (
        <div className="overflow-x-auto mt-3">
          <table className="w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="border-b">
                <th className="text-left px-4 py-3 w-2/9">Sender / Recipient</th>
                <th className="text-left px-4 py-3 w-4/9">Message</th>
                <th className="text-left px-4 py-3 w-2/9">Date</th>
                <th className="px-4 py-3 w-1/9"></th>
              </tr>
            </thead>
            <tbody>
              {paginatedMessages?.items.map(message => (
                <tr key={message.id}
                  onClick={() => navigate(`/members/${isInbox ? message.senderId : message.recipientId}/messages`)}
                  className={`border-b cursor-pointer hover:bg-gray-50 ${isInbox && !message.dateRead ? 'font-bold' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={isInbox ? message.senderImageUrl || '/user.png' : message.recipientImageUrl || '/user.png'}
                        alt="avatar"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <span>{isInbox ? message.senderDisplayName : message.recipientDisplayName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 truncate max-w-xs">{message.content}</td>
                  <td className="px-4 py-3 text-sm">{formatDate(message.messageSent)}</td>
                  <td className="px-4 py-3 text-center">
                    <DeleteButton onClick={(e) => handleDelete(e, message.id)} />
                  </td>
                </tr>
              ))}
              {paginatedMessages?.items.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                    No messages found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}