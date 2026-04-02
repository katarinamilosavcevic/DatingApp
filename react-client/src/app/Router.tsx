import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import HomePage from '../pages/HomePage';
import NotFoundPage from '../pages/NotFoundPage';
import ServerErrorPage from '../pages/ServerErrorPage';
import Navbar from '../features/nav/Navbar';
import MemberListPage from '../features/members/MemberListPage';
import MemberDetailPage from '../features/members/MemberDetailPage';
import MemberProfileTab from '../features/members/MemberProfileTab';
import MemberPhotosTab from '../features/members/MemberPhotosTab';
import ListsPage from '../pages/ListsPage';
import MessagesPage from '../pages/MessagesPage';
import AdminPage from '../pages/AdminPage';

function ProtectedRoute() {
  const { currentUser, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
  if (!currentUser) return <Navigate to="/" replace />;
  return <Outlet />;
}

function AdminRoute() {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.roles.includes('Admin') ||  currentUser?.roles.includes('Moderator');
  if (!isAdmin) return <Navigate to="/" replace />;
  return <Outlet />;
}

function Layout() {
  return (
    <div className="h-screen overflow-hidden">
      <Navbar />
      <main className="pt-24 px-6 h-full overflow-y-auto">
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
      { path: 'errors', element: <div>Test Errors page</div> },
      { path: 'server-error', element: <ServerErrorPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'members', element: <MemberListPage /> },
          { path: 'members/:id', element: <MemberDetailPage />,
            children: [
              { index: true, element: <Navigate to="profile" replace /> },
              { path: 'profile', element: <MemberProfileTab /> },
              { path: 'photos', element: <MemberPhotosTab /> },
              { path: 'messages', element: <div>Messages tab </div> },
            ] },
          { path: 'lists', element: <ListsPage /> },
          { path: 'messages', element: <MessagesPage /> },
          {
            element: <AdminRoute />,
            children: [
              { path: 'admin',  element: <AdminPage /> }
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