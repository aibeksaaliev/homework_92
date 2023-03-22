import React from 'react';
import {Grid} from "@mui/material";
import OnlineUsers from "../../components/OnlineUsers/OnlineUsers";
import ChatMessages from "../../components/ChatMessages/ChatMessages";

const Chat = () => {
  return (
    <Grid container>
       <Grid item xs={2} sx={{background: "gray"}}>
         <OnlineUsers/>
       </Grid>
      <Grid item xs={10}>
        <ChatMessages/>
      </Grid>
    </Grid>
  );
};

export default Chat;