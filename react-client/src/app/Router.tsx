import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import HomePage from '../pages/HomePage';
import NotFoundPage from '../pages/NotFoundPage';
import ServerErrorPage from '../pages/ServerErrorPage';
import Navbar from '../features/nav/NavBar';

function ProtectedRoute() {
  const { currentUser, loading } = useAuth();
  if (loading) return <p>Učitavanje...</p>;
  if (!currentUser) return <Navigate to="/" replace />;
  return <Outlet />;
}

function AdminRoute() {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.roles.includes('Admin') || 
                  currentUser?.roles.includes('Moderator');
  if (!isAdmin) return <Navigate to="/" replace />;
  return <Outlet />;
}

function Layout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 px-6">
        <Outlet />
      </main>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'errors', element: <div>Test Errors stranica</div> },
      { path: 'server-error', element: <ServerErrorPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'members', element: <div>Member List</div> },
          { path: 'members/:id', element: <div>Member Detail</div> },
          { path: 'lists', element: <div>Lists</div> },
          { path: 'messages', element: <div>Messages</div> },
          {
            element: <AdminRoute />,
            children: [
              { path: 'admin', element: <div>Admin</div> }
            ]
          }
        ]
      },
      { path: '*', element: <NotFoundPage /> }
    ]
  }
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}