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

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import publicAxios from "../../utils/publicAxios";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

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
      let res = await publicAxios.get("/servants");
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
      await publicAxios.delete(`/servants/${id}`);
      setData(data.filter((e) => e.id !== id));
      notifySuccess("Item deleted successfully !");
    } catch (error) {
      notifyError("Something getting wrong !");
    }
  };

  //   add data via modal
  const formSchema = Yup.object().shape({
    name: Yup.string().trim().required("* This field is required."),
    surname: Yup.string().trim().required("* This field is required."),
  });

  const {
    handleSubmit,
    formState: { errors },
    register,
    control,
    reset,
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    reset({
      name: "",
      surname: "",
    });
  };

  const addPerson = async (formData) => {
    try {
      let res = await publicAxios.post("/servants", formData);
      setData([...data, res?.data]);
      notifySuccess("Servant added successfully");
      handleClose();
    } catch (error) {
      notifyError("Something went wrong");
    }
  };

  return (
    <Grid container spacing={2}>
      <ToastContainer />
      <Grid item xs={12} display={"flex"} justifyContent={"end"}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
        >
          Add servant
        </Button>
      </Grid>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Surname</TableCell>
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
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.surname}</TableCell>
                    <TableCell align="right">
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

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <form onSubmit={handleSubmit(addPerson)}>
          <DialogTitle>{"Add person"}</DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <TextField
                      label="First Name"
                      variant="filled"
                      value={value}
                      onChange={onChange}
                      error={!!error}
                      helperText={error ? error.message : null}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="surname"
                  control={control}
                  defaultValue=""
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <TextField
                      label="Last Name"
                      variant="filled"
                      value={value}
                      onChange={onChange}
                      error={!!error}
                      helperText={error ? error.message : null}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              type="button"
              variant="outlined"
              color="error"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button type="submit" variant="outlined" color="success">
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Grid>
  );
}

export default Servants;
