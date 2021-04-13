import React, {useEffect, useRef, useState} from 'react';
import socket from "../socket";

const Chat = ({users, messages, userName, roomId}) => {
    const [messageValue, setMessageValue] = useState('');
    const messagesRef = useRef(null);
    const prependZero = (num) => {
        return ("0" + num).slice(-2);
    }
    const onSendMessage = () => {
        if(messageValue.length > 0){
            let date = new Date();
            let dateMessage = `${prependZero(date.getDate())}.${prependZero(date.getMonth())}.${date.getFullYear()} ${prependZero(date.getHours())}:${prependZero(date.getMinutes())}`
            socket.emit('ROOM:NEW_MESSAGE', {
                userName,
                roomId,
                dateMessage,
                text: messageValue
            })
            setMessageValue(''); // Clear textarea after send
        }
    }
    useEffect(() => {
        messagesRef.current.scrollTo(0, 99999); // Scroll chat if messages > height
    }, [messages])

    return (
        <div className={'chat'}>
            <div className="chat-aside">
                <div className="chat-title">Комната: {roomId}</div>
                <div className="chat-aside__title">Онлайн ({users.length})</div>
                <ul>
                    {users.map((user, index) => <li key={user + index}>{user}</li>)}
                </ul>
            </div>
            <div className="chat-content">
                <div ref={messagesRef} className="chat-content__messages">
                    <ul>
                        {messages.map((message, index) =>
                            <li key={message.userName + index}>
                                <p className={'chat-content__message'}>{message.text}</p>
                                <span className={'chat-content__message-info'}>{message.userName}</span>
                                <span className={'chat-content__message-info'}>{message.dateMessage}</span>
                            </li>
                        )}
                    </ul>
                </div>
                <textarea value={messageValue} onChange={e => setMessageValue(e.target.value)} rows={4}></textarea>
                <button onClick={onSendMessage}>Отправить</button>

            </div>
        </div>
    );
};

export default Chat;