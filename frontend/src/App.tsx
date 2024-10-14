import './App.css'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Login from './components/login';

function Layout(): JSX.Element {
  return <Outlet />;
}

const appRouting = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "login",  
        element: <Login />
      }
    ]
  }
]);

function App() {
  return (
    <RouterProvider router={appRouting} />
  );
}

export default App;
