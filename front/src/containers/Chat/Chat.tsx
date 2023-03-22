import React, {useEffect, useRef, useState} from 'react';
import {Box, Grid, List, ListItem, ListItemText, TextField} from "@mui/material";
import {useAppSelector} from "../../app/hooks";
import {selectUser} from "../../features/users/UsersSlice";
import {IncomingMessage, Message, OnlineUser} from "../../types";
import {LoadingButton} from "@mui/lab";
import SendIcon from '@mui/icons-material/Send';

const Chat = () => {
  const user = useAppSelector(selectUser);
  const ws = useRef<WebSocket | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<OnlineUser[]>([]);

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


  return (
    <Grid container>
      <Grid item xs={2} sx={{background: "gray"}}>
        <List>
          {users.map(user => {
            return <ListItem key={user._id}>
              <ListItemText>
                {user.username}
              </ListItemText>
              <span style={{
                display: "block",
                width: "15px",
                height: "15px",
                background: "green",
                borderRadius: "50%"
              }}/>
            </ListItem>
          })}
        </List>
      </Grid>
      <Grid item xs={10}>
        <Box>
          <Box style={{height: "76vh", overflowY: "scroll"}} ref={scrollRef}>
            <List>
              {messages.map(msg => {
                return <Box
                  component="div"
                  key={msg._id}
                  sx={{
                    display: 'block',
                    width: "100%",
                    background: msg.author._id !== user?._id ? "#25C2E1" : "#F1DD4C",
                    m: 0.5, p: 1,
                    borderRadius: msg.author._id !== user?._id ? "0 8px 8px 8px" : "8px 8px 0 8px",
                    textAlign: msg.author._id !== user?._id ? "left" : "right"
                  }}
                >
                <span>
                  {msg.author.username} : {msg.text}
                </span>
                </Box>
              })}
            </List>
          </Box>
          <form
            onSubmit={submitForm}
            autoComplete="off"
          >
            <Grid container spacing={2} alignItems="center" sx={{px: 1, my: 1}}>
              <Grid item xs={10}>
                <TextField
                  id="text" label="Message"
                  value={message}
                  fullWidth
                  required
                  name="text"
                  onChange={(event) => setMessage(event.target.value)}
                />
              </Grid>
              <Grid item xs={2}>
                <LoadingButton
                  type="submit"
                  color="primary"
                  variant="contained"
                >
                  <SendIcon/>
                </LoadingButton>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Chat;