import { createBrowserRouter, Navigate, RouterProvider, useNavigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { EditPage, SignInPage, SignUpPage } from './pages';
import { AuthContextProvider } from './auth-context';

export const App = () => {
  return <RouterProvider router={router} />;
};

export const Routing = () => {
  const navigate = useNavigate();

  const redirectToSignIn = () => navigate('/signin');

  return (
    <AuthContextProvider onRefreshFail={redirectToSignIn}>
      <Routes>
        <Route path="/edit" element={<EditPage />} />
        <Route path="/edit/:projectId" element={<EditPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="*" element={<Navigate to="/edit" replace />} />
      </Routes>
    </AuthContextProvider>
  );
};

const router = createBrowserRouter([{ path: '*', element: <Routing /> }]);
