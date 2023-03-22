import React, {PropsWithChildren} from 'react';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {Link} from "react-router-dom";
import AnonymousMenu from "../UI/AppToolbar/AnonymousMenu";
import UsersMenu from "../UI/AppToolbar/UsersMenu";
import {useAppSelector} from "../../app/hooks";
import {selectUser} from "../../features/users/UsersSlice";

const Layout: React.FC<PropsWithChildren> = ({children}) => {
  const user = useAppSelector(selectUser);

  const theme = createTheme({
    palette: {
      primary: {
        main: '#424242',
      },
      secondary: {
        light: '#0066ff',
        main: '#0044ff',
        contrastText: '#ffcc00',
      },
      contrastThreshold: 3,
      tonalOffset: 0.2,
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <div style={{display: "flex", flexDirection: "column", height: "100vh"}}>
        <AppBar position="relative">
          <Toolbar sx={{display: "flex", justifyContent: "space-between"}}>
            <Link to="/" style={{textDecoration: "none", color: "inherit", display: "flex", alignItems: "center"}}>
              Live Chat
            </Link>
            {user ? (<UsersMenu user={user}/>) : (<AnonymousMenu/>)}
          </Toolbar>
        </AppBar>
        <main style={{marginBottom: "auto"}}>
          {children}
        </main>
        <Box sx={{bgcolor: 'background.paper', p: 6, marginTop: "auto"}} component="footer">
          <Typography variant="h6" align="center" gutterBottom>
            Footer
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            component="p"
          >
            Something here to give the footer a purpose!
          </Typography>
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default Layout;