import React from 'react';
import {Button, Container, Grid, Typography} from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import {useNavigate} from "react-router-dom";

const Error = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Grid container sx={{display: "flex", justifyContent: "center", mt: 5}}>
        <Grid item sx={{textAlign: "center"}}>
          <Typography variant="h1">
            404
          </Typography>
          <Typography variant="h6" sx={{mb: 3}}>
            The page you’re looking for doesn’t exist.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/')}><HomeIcon/></Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Error;