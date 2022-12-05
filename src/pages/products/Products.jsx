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
} from "@mui/material";

import Slide from "@mui/material/Slide";

import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { CircularProgress } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import publicAxios from "../../utils/publicAxios";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "react-router-dom";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Servants() {
  // success message
  const notifySuccess = (message) =>
    toast.success(`${message}`, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  // error message
  const notifyError = (message) =>
    toast.error(`${message}`, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const [data, setData] = useState([]);
  const [pending, setPending] = useState(false);

  //   get data from api
  const getData = async () => {
    setPending(true);

    try {
      let res = await publicAxios.get("/products");
      setData(res?.data);
      setPending(false);
    } catch (error) {
      setData([]);
      setPending(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  //   delete data via id
  const handleDataDelete = async (id) => {
    try {
      await publicAxios.delete(`/products/${id}`);
      setData(data.filter((e) => e.id !== id));
    } catch (error) {
      notifyError("Something getting wrong !");
    }
  };

  return (
    <Grid container spacing={2}>
      <ToastContainer />
      <Grid item xs={12} display={"flex"} justifyContent={"end"}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          component={Link}
          to={`/products/add`}
        >
          Add Product
        </Button>
      </Grid>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Description</TableCell>
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
                    key={row.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell>{row?.name}</TableCell>
                    <TableCell>{row?.price}</TableCell>
                    <TableCell>{row?.description}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        aria-label="delete"
                        size="large"
                        color="primary"
                        component={Link}
                        to={`/products/${row?.id}/edit`}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        size="large"
                        color="error"
                        onClick={() => handleDataDelete(row?.id)}
                      >
                        <DeleteForeverIcon />
                      </IconButton>
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

export default Servants;
