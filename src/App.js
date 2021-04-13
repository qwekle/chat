import LoginBlock from "./components/LoginBlock";
import socket from "./socket";
import {useEffect, useReducer} from "react";
import reducer from "./reducer";
import Chat from "./components/Chat";


function App() {
    const [state, dispatch] = useReducer(reducer, {
        joined: false,
        roomId: null,
        userName: null,
        users: [],
        messages: [],
    });

    const onLogin = (obj) => {
        dispatch({
            type: 'JOIN',
            payload: obj
        })
        socket.emit('ROOM:JOIN', obj)

    }
    const setUsers = (users) => {
        dispatch({
            type: 'SET_USERS',
            payload: users,
        })
    }
    useEffect(() => {
        socket.on('ROOM:SET_USERS', users => setUsers(users));
        socket.on('ROOM:NEW_MESSAGE', message => {
            dispatch({
                type: "NEW_MESSAGES",
                payload: message,
            })
        });
    }, [])

    return (
        <div className="wrapper">
            {!state.joined ?
                <LoginBlock onLogin={onLogin}/>
                :
                <Chat {...state}/>
            }
        </div>
    );
}

export default App;
