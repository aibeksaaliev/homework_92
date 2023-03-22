import React from 'react';
import {List, ListItem, ListItemText} from "@mui/material";

const OnlineUsers = () => {
  return (
    <List>
      <ListItem>
        <ListItemText>
          User 1
        </ListItemText>
      </ListItem>
      <ListItem>
        <ListItemText>
          User 2
        </ListItemText>
      </ListItem>
      <ListItem>
        <ListItemText>
          User 3
        </ListItemText>
      </ListItem>
      <ListItem>
        <ListItemText>
          User 4
        </ListItemText>
      </ListItem>
    </List>
  );
};

export default OnlineUsers;