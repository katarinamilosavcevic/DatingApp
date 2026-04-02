import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center gap-4 mt-10">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        strokeWidth={1.5} stroke="currentColor" className="w-32 h-32 text-red-500">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
      <h1 className="text-4xl font-bold">Not found</h1>
      <p className="text-xl text-center text-gray-600">Sorry, what you are looking for cannot be found</p>
      <button onClick={() => navigate(-1)}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-700">
        Go back
      </button>
    </div>
  );
}