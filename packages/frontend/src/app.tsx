import { createBrowserRouter, Navigate, RouterProvider, useNavigate } from 'react-router-dom';
import { Routes, Route, useLocation } from 'react-router-dom';
import { EditPage, SignInPage, SignUpPage, ProjectListPage } from './pages';
import { AuthContextProvider } from './auth-context';
import { RequireAuth } from './require-auth';

export const App = () => {
  return <RouterProvider router={router} />;
};

export const Routing = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const redirectToSignIn = () => navigate('/signin', { state: { from: location.pathname } });

  return (
    <AuthContextProvider onRefreshFail={redirectToSignIn}>
      <Routes>
        <Route path="/edit" element={<EditPage readonly={false} />} />
        <Route element={<RequireAuth />}>
          <Route path="/edit/:projectId" element={<EditPage readonly={false} />} />
          <Route path="/view/:projectId" element={<EditPage readonly={true} />} />
          <Route path="/projects" element={<ProjectListPage />} />
        </Route>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="*" element={<Navigate to="/edit" replace />} />
      </Routes>
    </AuthContextProvider>
  );
};

const router = createBrowserRouter([{ path: '*', element: <Routing /> }]);
