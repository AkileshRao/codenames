import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import '../globals.css'
import 'unfonts.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import GoBackToHome from './pages/GoBackToHome.tsx';
// import Room from './pages/Room.tsx';
import { SocketProvider } from './state/SocketContext.tsx';
import JoinRoom from './components/JoinRoom.tsx';
import ActiveRoom from './components/ActiveRoom.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/room',
    element: <GoBackToHome />
  },
  {
    path: "/room/:roomId",
    element: <ActiveRoom />
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <SocketProvider>
    <RouterProvider router={router} />
  </SocketProvider>
  // </React.StrictMode>,
)
