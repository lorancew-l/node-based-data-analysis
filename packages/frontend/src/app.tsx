import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { EditPage } from './pages/edit-page/edit-page';

const router = createBrowserRouter([
  {
    path: 'edit',
    element: <EditPage />,
  },
  {
    path: '/',
    element: <EditPage />,
  },
]);

export const App = () => {
  return <RouterProvider router={router} />;
};
