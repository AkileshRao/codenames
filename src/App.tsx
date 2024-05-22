import { useEffect, useState } from 'react'
import './App.css'
import { useNavigate } from 'react-router-dom';
import { Socket, io } from 'socket.io-client';
import Cookies from 'js-cookie';

function App() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  //Only keep active rooms from the backend inside client localstorage.
  useEffect(() => {
    async function getCurrentRoom() {
      const res = await fetch('http://localhost:3000/rooms');
      const { rooms } = await res.json();
      const currentStoredRoom = localStorage.getItem('room');
      if (currentStoredRoom && rooms.indexOf(JSON.parse(currentStoredRoom).roomId) < 0) {
        localStorage.removeItem('room')
      }
    }
    getCurrentRoom()
  }, [])

  useEffect(() => {
    const storedSocketId = Cookies.get('socketId');
    const room = JSON.parse(localStorage.getItem('room') as string);

    if (storedSocketId && room) {
      io("http://localhost:3000", {
        query: {
          roomId: room.roomId,
          socketId: storedSocketId
        }
      })
      navigate(`/room/${room.roomId}`)
    } else {
      Cookies.remove('socketId');
      localStorage.removeItem('room');
    }
  }, [])

  const createRoom = () => {
    const roomId = Math.floor(Math.random() * 100000000);  //Creating a random roomID
    let socket = io("http://localhost:3000", {
      query: {
        roomId,
        name,
      }
    })

    socket?.on("connect", () => {
      Cookies.set('socketId', socket.id as string, { expires: 1 })
      const roomAndUserData = {
        roomId,
        userId: socket.id,
        userName: name,
      }
      localStorage.setItem('room', JSON.stringify(roomAndUserData))
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
