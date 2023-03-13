import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from './pages/Root';
// import ErrorPage from './pages/ErrorPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Logout from './pages/Logout';
import Flashcards from './pages/Flashcards';
import Notes from './pages/Notes';
import EditNote from "./pages/EditNote.js"
import EditFlashcard from "./pages/EditFlashcard.js"
import NewNote from './pages/NewNote';
import ProtectedRoute from './components/ProtectedRoute.js';
import Index from "./pages/Index"
import './index.css';
// Hi everyone
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    // errorElement: <ErrorPage />,
    children: [
      // {
        //   path: "login",
        //   element: <Login />,
        // },
        {
          path: "/logout",
          element: <ProtectedRoute><Logout /></ProtectedRoute>,
        },
        {
          index: true,
          element: <Index /> //users will land at the login page
        },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/notes",
        element: <ProtectedRoute><Notes /></ProtectedRoute>,
      },
      {
        path: "/flascards",
        element: <ProtectedRoute><Flashcards /></ProtectedRoute>,
      },
      {
        path: "/notes/new",
        element: <ProtectedRoute><NewNote /></ProtectedRoute>
      },
      {
        path: "/login",
        element: <Login />
      },
      // {
      //   path:"",
      //   element:<ProtectedRoute/>
      // }
    ]
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();