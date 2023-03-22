import React, {useState} from 'react';
import {User} from '../../../types';
import {Box, Button, Menu, MenuItem} from '@mui/material';
import {useNavigate} from "react-router-dom";
import {useAppDispatch} from "../../../app/hooks";
import {logout} from "../../../features/users/UsersThunks";
import {Avatar} from "@mui/material";
import {apiUrl} from "../../../constants";

interface Props {
  user: User;
}

const UsersMenu: React.FC<Props> = ({user}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
  };

  let avatar = "";

  if (user.avatar) {
    if (user.googleId || user.facebookId) {
      avatar = user.avatar;
    } else {
      avatar = apiUrl + user.avatar;
    }
  }

  return (
    <>
      <Box sx={{display: "flex"}}>
        <Button
          onClick={handleClick}
          color="inherit"
        >
          Hello, {user.displayName}
        </Button>
        <Avatar alt={user.displayName} src={avatar}/>
      </Box>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default UsersMenu;