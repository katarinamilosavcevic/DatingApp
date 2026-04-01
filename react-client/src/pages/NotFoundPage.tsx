import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center mt-20 gap-4">
      <h1 className="text-4xl">404 — Not found</h1>
      <button className="btn btn-primary" onClick={() => navigate('/')}>Go back</button>
    </div>
  );
}