import React, {useState} from 'react';
import socket from "../socket";
import axios from "axios";

const LoginBlock = ({onLogin}) => {
    const [roomId, setRoomId] = useState('');
    const [userName, setUserName] = useState('');
    const [isLoading, setLoading] = useState(false);
    const onEnter = async () => {
        if (!roomId || !userName) {
            alert('заполните поля');
        }
        const obj = {
            roomId,
            userName
        }
        socket.emit('ROOM:JOIN', obj);
        setLoading(true);
        await axios.post('/rooms', {roomId, userName})
        onLogin(obj);
    }

    return (
        <form className="login-block" onSubmit={e => e.preventDefault()}>
            <input type="text" placeholder={'Введите id комнаты'} value={roomId}
                   onChange={e => setRoomId(e.target.value)}
            />
            <input type="text" placeholder={'Введите имя'} value={userName}
                   onChange={e => setUserName(e.target.value)}
            />
            <button disable={isLoading.toString()} type='subscribe' onClick={onEnter}>{isLoading ? 'Вход...' : 'Войти'}</button>
        </form>
    );
};

export default LoginBlock;