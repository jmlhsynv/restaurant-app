import React, { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import {
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";

import Slide from "@mui/material/Slide";

import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { CircularProgress } from "@mui/material";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import publicAxios from "../../utils/publicAxios";
import { Link } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Orders() {
  const [data, setData] = useState([]);
  const [servants, setServants] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [tables, setTables] = useState([]);
  const [pending, setPending] = useState(false);

  //   get data from api
  const getData = async () => {
    setPending(true);
    try {
      let res = await publicAxios.get("/orders");
      let result = res?.data;
      result
        .sort((a, b) => new Date(b.endDate) - new Date(a.endDate))
        .sort((a, b) => a.status - b.status);
      setData(result);
      setPending(false);
    } catch (error) {
      setData([]);
      setPending(false);
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

  const getTables = async () => {
    try {
      let res = await publicAxios.get("/tables");
      setTables(res?.data);
    } catch (error) {
      setTables([]);
    }
  };

  const getStatuses = async () => {
    try {
      let res = await publicAxios.get("/statuses");
      setStatuses(res?.data);
    } catch (error) {
      setStatuses([]);
    }
  };

  useEffect(() => {
    getData();
    getStatuses();
    getTables();
    getServants();
  }, []);

  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    let price = 0;
    if (data) {
      data?.map((e) => {
        if (e.totalPrice && e.totalPrice?.length > 0) {
          price += Number(e?.totalPrice);
        }
      });
    }
    setTotalPrice(price);
  }, [data]);

  return (
    <Grid container spacing={2}>
      <ToastContainer />
      <Grid item xs={12} display={"flex"} justifyContent={"space-between"}>
        <Typography>
          {totalPrice && totalPrice > 0
            ? "Total Price - " + totalPrice + " AZN"
            : ""}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          component={Link}
          to={`/orders/add`}
        >
          New Order
        </Button>
      </Grid>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Table</TableCell>
                <TableCell>Servant</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Total Price</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell align="right">
                  <ManageAccountsIcon />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pending ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : !pending && data ? (
                data.map((row, index) => (
                  <TableRow
                    key={row.id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      background: row?.status == 1 && "#dbdeb8",
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      {tables?.find((e) => e.id == row?.table)?.name}
                    </TableCell>
                    <TableCell>
                      {servants?.find((e) => e.id == row?.servant)?.name}
                    </TableCell>
                    <TableCell>
                      {statuses?.find((e) => e.id == row?.status)?.name}
                    </TableCell>
                    <TableCell>
                      {row?.totalPrice && row?.totalPrice + " AZN"}
                    </TableCell>
                    <TableCell>{row?.endDate}</TableCell>
                    <TableCell align="right">
                      {row?.status == 1 ? (
                        <IconButton
                          aria-label="delete"
                          size="large"
                          color="primary"
                          component={Link}
                          to={`/orders/${row?.id}`}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      ) : (
                        <></>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}

export default Orders;
