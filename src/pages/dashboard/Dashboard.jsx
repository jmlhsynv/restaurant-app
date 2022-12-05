import { Container, Grid, Paper } from "@mui/material";
import React, { useState, useEffect } from "react";
import GroupsIcon from "@mui/icons-material/Groups";
import TableBarIcon from "@mui/icons-material/TableBar";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import ListAltIcon from "@mui/icons-material/ListAlt";
import publicAxios from "../../utils/publicAxios";

function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [servants, setServants] = useState([]);
  const [products, setProducts] = useState([]);
  const [tables, setTables] = useState([]);

  //   get data from api
  const getData = async () => {
    try {
      let res = await publicAxios.get("/orders");
      setOrders(res?.data);
    } catch (error) {
      setOrders([]);
    }
  };
  const getServants = async () => {
    try {
      let res = await publicAxios.get("/servants");
      setServants(res?.data);
    } catch (error) {
      setServants([]);
    }
  };
  const getProducts = async () => {
    try {
      let res = await publicAxios.get("/products");
      setProducts(res?.data);
    } catch (error) {
      setProducts([]);
    }
  };
  const getTables = async () => {
    try {
      let res = await publicAxios.get("/tables");
      setTables(res?.data);
    } catch (error) {
      setTables([]);
    }
  };

  useEffect(() => {
    getTables();
    getServants();
    getData();
    getProducts();
  }, []);
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Paper sx={{ padding: "15px" }}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <ListAltIcon sx={{ width: "70px", height: "70px" }} />
            </Grid>
            <Grid item xs={8}>
              <h1>{orders?.length} orders</h1>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={6}>
        <Paper sx={{ padding: "15px" }}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TableBarIcon sx={{ width: "70px", height: "70px" }} />
            </Grid>
            <Grid item xs={8}>
              <h1>{tables?.length} tables</h1>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={6}>
        <Paper sx={{ padding: "15px" }}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <GroupsIcon sx={{ width: "70px", height: "70px" }} />
            </Grid>
            <Grid item xs={8}>
              <h1>{servants?.length} servants</h1>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={6}>
        <Paper sx={{ padding: "15px" }}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <FastfoodIcon sx={{ width: "70px", height: "70px" }} />
            </Grid>
            <Grid item xs={8}>
              <h1>{products?.length} products</h1>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Dashboard;
