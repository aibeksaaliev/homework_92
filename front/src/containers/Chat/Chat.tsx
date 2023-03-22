import React, {useEffect, useRef, useState} from 'react';
import {Box, Grid, List, ListItem, ListItemText, TextField} from "@mui/material";
import {useAppSelector} from "../../app/hooks";
import {selectUser} from "../../features/users/UsersSlice";
import {IncomingMessage, Message, OnlineUser} from "../../types";
import {LoadingButton} from "@mui/lab";

const Chat = () => {
  const user = useAppSelector(selectUser);
  const ws = useRef<WebSocket | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<OnlineUser[]>([]);

  useEffect(() => {
    const connectToWebSocket = () => {
      ws.current = new WebSocket('ws://localhost:8000/chat');

      ws.current.onopen = () => {
        if (ws.current) {
          ws.current.send(JSON.stringify({
            type: "LOGIN",
            payload: user?.token
          }));
        }
      };

      ws.current.onclose = () => {
        console.log("Web Socket closed");
        setTimeout(connectToWebSocket, 5000);
      };

      ws.current.onmessage = (event) => {
        const decodedMessage = JSON.parse(event.data) as IncomingMessage;

        if (decodedMessage.type === "LAST_MESSAGES") {
          setMessages(decodedMessage.payload as Message[]);
        }

        if (decodedMessage.type === "ONLINE_USERS") {
          setUsers(decodedMessage.payload as unknown as OnlineUser[]);
        }

        if (decodedMessage.type === "NEW_MESSAGE") {
          const newMessages = decodedMessage.payload as Message[];
          setMessages(prevState => {
            const filteredMessages = prevState.filter(msg => !newMessages.some(newMsg => newMsg._id === msg._id));
            return [...filteredMessages, ...newMessages];
          });
        }
      }
    };

    connectToWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);


  useEffect(() => {
    const scrollDiv = scrollRef.current;
    if (scrollDiv) {
      scrollDiv.scrollTop = scrollDiv.scrollHeight;
    }
  }, [messages]);

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: "SEND_MESSAGE",
        payload: message
      }));
    }

    setMessage("");
  };

  return (
    <Grid container>
       <Grid item xs={2} sx={{background: "gray"}}>
         <List>
           {users.map(user => {
             return <ListItem key={user._id}>
               <ListItemText>
                 {user.username}
               </ListItemText>
             </ListItem>
           })}
         </List>
       </Grid>
      <Grid item xs={10}>
        <div>
          <div style={{height: "76vh", overflowY: "scroll"}} ref={scrollRef}>
            {messages.map(msg => {
              return <Box
                component="span"
                key={msg._id}
                sx={{display: 'block', background: "#25C2E1", m:0.5, p:1, borderRadius: 2}}
              >
                {msg.author.username} : {msg.text}
              </Box>
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
      </Grid>
    </Grid>
  );
};

export default Chat;