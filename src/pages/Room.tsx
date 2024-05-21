import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom';
const Room = () => {
    const { roomId } = useParams();
    const lobbies = JSON.parse(localStorage.getItem('lobbies') as string);
    const currentLobby = lobbies?.[roomId as string];

    useEffect(() => {

    }, [])

    if (!currentLobby) {
        return (
            <div>
                <p>Could not find room!</p>
                <Link to="/">Go back to homepage</Link>
            </div>
        )
    }

    return (
        <div>Room {roomId}</div>
    )
}

export default Room