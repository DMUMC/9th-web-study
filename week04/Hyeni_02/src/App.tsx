import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css'
import { MainPage } from './pages/MainPage';
import { LoginPage } from './pages/LoginPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />,
    children: [
      {
        index: true,
        element: <div className='p-4'>메인 페이지 콘텐츠입니다.</div>
      },
      {
        path: '/login',
        element: <LoginPage />
      }
    ]
  },
]);

export function App() {

  return (
    <>
      <RouterProvider router={router} />;
    </>
  )
}