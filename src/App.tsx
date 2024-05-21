import { useState } from 'react'
import './App.css'
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

function App() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const createRoom = () => {
    const roomId = Math.floor(Math.random() * 100000000);
    const socket = io("http://localhost:3000", {
      query: {
        roomId,
      }
    })

    socket.on("connect", () => {
      const roomAndUserData = {
        roomId,
        userId: socket.id,
        userName: name,
      }

      if (localStorage.getItem('lobbies')) {
        const lobbies = JSON.parse(localStorage.getItem('lobbies') as string);
        localStorage.setItem('lobbies', JSON.stringify({ ...lobbies, [roomId]: roomAndUserData }))
      } else {
        localStorage.setItem('lobbies', JSON.stringify({ [roomId]: roomAndUserData }));
      }
      navigate(`/room/${roomId}`)
    })
  }

  return (
    <div>
      <h1 className='font-bold mb-4'>Welcome to codenames online</h1>
      <input
        type="text"
        placeholder='Enter your name'
        className='p-2 me-3 text-xl rounded'
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={createRoom}>Create room</button>
    </div>
  )
}

export default App
