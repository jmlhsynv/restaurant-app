import { Button, Grid, Paper, TextField, Typography } from "@mui/material";
import React from "react";

function Login() {
  return (
    <Grid container>
      <Grid
        item
        xs={12}
        sx={{
          height: "100vh",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Grid container display={"flex"} justifyContent={"center"}>
          <Grid item xs={10} sm={6} md={4}>
            <Paper sx={{ padding: "15px" }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography> Log in</Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Username" variant="filled" fullWidth />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    type="password"
                    label="Password"
                    variant="filled"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="outlined" color="primary" fullWidth>
                    Login
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Login;
