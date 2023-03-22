import React, {useEffect, useRef, useState} from 'react';
import {TextField} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {useAppSelector} from "../../app/hooks";
import {selectUser} from "../../features/users/UsersSlice";
import {IncomingMessage, Message} from "../../types";

const ChatMessages = () => {
  const ws = useRef<WebSocket | null>(null);
  const user = useAppSelector(selectUser);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8000/chat');

    ws.current.onopen = () => {
      ws.current?.send(JSON.stringify({
        type: "LOGIN",
        payload: user?.token
      }));
    };

    ws.current.onclose = () => console.log("Web Socket closed");


    ws.current.onmessage = (event) => {
      const decodedMessage = JSON.parse(event.data) as IncomingMessage;

      if (decodedMessage.type === "LAST_MESSAGES") {
        setMessages(decodedMessage.payload as Message[]);
      }

      if (decodedMessage.type === "NEW_MESSAGE") {
        const newMessages = decodedMessage.payload as Message[];
        setMessages(prevState => {
          const filteredMessages = prevState.filter(msg => !newMessages.some(newMsg => newMsg._id === msg._id));
          return [...filteredMessages, ...newMessages];
        });
      }
    }
  }, []);

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: "SEND_MESSAGE",
        payload: message
      }));
    }
  };




  return (
    <div>
      <div>
        {messages.map(msg => {
          return <p key={msg._id}>{msg.text}</p>
        })}
      </div>
      <form
        onSubmit={submitForm}
        autoComplete="off"
      >
        <TextField
          id="text" label="Message"
          value={message}
          fullWidth
          required
          name="text"
          onChange={(event) => setMessage(event.target.value)}
          // error={Boolean(getFieldError('text'))}
          // helperText={getFieldError('text')}
        />
        <LoadingButton
          type="submit"
          color="primary"
          variant="contained"
        >
          Send
        </LoadingButton>
      </form>
    </div>
  );
};

export default ChatMessages;








// import React, { useState, useEffect, useRef } from 'react';
// import { connectChat } from '../../Store/Actions/actionChat';
// import { Alert, Input, InputGroup, InputGroupAddon } from 'reactstrap';
// import { useAppSelector } from '../../app/hooks';
// import { selectUser } from '../../features/users/UsersSlice';
// import { IncomingMessage } from '../../types';
//
// const Chat = () => {
//   const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState<any[]>([]);
//   const [loginError, setLoginError] = useState<string | null>(null);
//   const user = useAppSelector(selectUser);
//   const websocket = useRef<WebSocket | null>(null);
//
//   useEffect(() => {
//     websocket.current = connectChat(user.token);
//
//     websocket.current.onmessage = (event) => {
//       const decodedMessage = JSON.parse(event.data) as IncomingMessage;
//       switch (decodedMessage.type) {
//         case 'ONLINE_USERS':
//           setOnlineUsers(decodedMessage.user);
//           break;
//         case 'NEW_MESSAGES':
//           setMessages([decodedMessage.message, ...messages]);
//           break;
//         case 'ALL_MESSAGES':
//           setMessages(decodedMessage.messages);
//           break;
//         case 'LOGIN_ERROR':
//           setLoginError(decodedMessage.message);
//           break;
//         default:
//           break;
//       }
//     };
//
//     return () => {
//       websocket.current?.close();
//     };
//   }, []);
//
//   const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setMessage(e.target.value);
//   };
//
//   const sendMessage = () => {
//     websocket.current?.send(
//       JSON.stringify({
//         type: 'CREATE_MESSAGE',
//         message: message,
//       })
//     );
//   };
//
//   const deleteMessage = (id: string) => {
//     websocket.current?.send(
//       JSON.stringify({
//         type: 'DELETE_MESSAGE',
//         id: id,
//       })
//     );
//   };
//
//   return (
//     <div style={blockChat}>
//       <div style={onlineStyle}>
//         {onlineUsers.map((user) => (
//           <p key={user.key}>{user.username}</p>
//         ))}
//       </div>
//       <div style={blockMessage}>
//         <InputGroup>
//           <Input value={message} onChange={inputChangeHandler} />
//           <InputGroupAddon addonType="append">
//             <button onClick={sendMessage}>Send</button>
//           </InputGroupAddon>
//         </InputGroup>
//         <div>
//           {messages.map((message) => (
//             <Alert color="success" key={message._id}>
//               {user.role === 'moderator' && (
//                 <button onClick={() => deleteMessage(message._id)}>
//                   &#10008;
//                 </button>
//               )}
//               {message.username ? (
//                 <b>{message.username} - </b>
//               ) : (
//                 <b>{message.userId.username} - </b>
//               )}
//               {message.message}{' '}
//               <small style={{ right: '80%' }}>{message.datetime}</small>
//             </Alert>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };
//
// const blockChat = {
//   display: 'flex',
// };
// const onlineStyle = {
//   padding: '20px',
//   border: '1px solid black',
//   width: '20%',
// };
// const blockMessage = {
//   width: '50%',
//   border: '1px solid black',
//   overflow: 'scroll',
// };
//
// export default Chat;
