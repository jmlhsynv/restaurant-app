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
  ButtonGroup,
  Typography,
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
import { useNavigate, useParams } from "react-router-dom";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import RemoveIcon from "@mui/icons-material/Remove";
import CancelIcon from "@mui/icons-material/Cancel";
import DoneAllIcon from "@mui/icons-material/DoneAll";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ViewOrder() {
  const navigate = useNavigate();
  const { id } = useParams();
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
  const [products, setProducts] = useState([]);
  const [pending, setPending] = useState(false);
  const [productCount, setProductCount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  // increase product count
  const handleIncrease = () => {
    setProductCount((state) => state + 1);
  };

  // decrease product count
  const handleDecrease = () => {
    if (productCount > 1) {
      setProductCount((state) => state - 1);
    }
  };

  //   get data from api
  const getProducts = async () => {
    try {
      let res = await publicAxios.get(`/products`);
      setProducts(res?.data);
    } catch (error) {
      setProducts([]);
    }
  };

  const getData = async () => {
    setPending(true);
    try {
      let res = await publicAxios.get(`/orders/${id}`);
      setData(res?.data?.content);
      setTotalPrice(res?.data?.totalPrice);
      setPending(false);
    } catch (error) {
      setData([]);
      setPending(false);
    }
  };

  useEffect(() => {
    getProducts();
    getData();
  }, []);

  //   add data via modal
  const formSchema = Yup.object().shape({
    product: Yup.string().trim().required("* This field is required."),
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
      product: "",
    });
    setProductCount(1);
  };

  const addContent = async (formData) => {
    const date = new Date().toJSON();

    let product = products?.find((e) => e.id == formData?.product);
    let lastID = 1;
    if (data?.length > 0) {
      let arr = data?.sort((a, b) => b.id - a.id);
      lastID = arr[0]?.id + 1;
    }

    let content = {
      id: lastID,
      name: product?.name,
      count: productCount,
      amount: product?.price * productCount,
      order_time: date,
      pending: "-",
      status: "gozleyir",
    };

    let postData = [...data, content];

    let price = 0;
    if (postData?.length > 0) {
      postData.map((e) => {
        price += Number(e.amount);
      });
    }

    try {
      let res = await publicAxios.patch(`/orders/${id}`, {
        content: postData,
        totalPrice: price,
      });
      setData(postData);
      setTotalPrice(price);
      notifySuccess("Content added successfully");
      handleClose();
    } catch (error) {
      notifyError("Something went wrong");
    }
  };

  // Done item
  const handleDoneItem = async (content_id) => {
    let el = data.find((e) => e.id == content_id);
    let date = new Date(el.order_time);
    let now = new Date();
    let diff = Math.floor((now - date) / 1000 / 60);
    el.status = "verildi";
    el.pending = diff + " min";

    try {
      await publicAxios.patch(`/orders/${id}`, {
        content: data,
      });
      setData(data);
      notifySuccess("Content changed successfully");
      handleClose();
    } catch (error) {
      notifyError("Something went wrong");
    }
  };

  // cancel item
  const handleCancelItem = async (content_id) => {
    let el = data.find((e) => e.id == content_id);
    el.status = "legv edildi";

    try {
      await publicAxios.patch(`/orders/${id}`, {
        content: data,
      });
      setData(data);
      notifySuccess("Content cancelled successfully");
      handleClose();
    } catch (error) {
      notifyError("Something went wrong");
    }
  };

  // end Order
  const endOrder = async () => {
    let date = new Date().toJSON();
    try {
      await publicAxios.patch(`/orders/${id}`, {
        status: 2,
        endDate: date,
      });
      notifySuccess("Order ended successfully");
      navigate("/orders");
    } catch (error) {
      notifyError("Something went wrong");
    }
  };

  // cancel order
  const cancelOrder = async () => {
    let date = new Date().toJSON();
    try {
      await publicAxios.patch(`/orders/${id}`, {
        status: 3,
        endDate: date,
      });
      notifySuccess("Order cancelled successfully");
      navigate("/orders");
    } catch (error) {
      notifyError("Something went wrong");
    }
  };

  return (
    <Grid container spacing={2}>
      <ToastContainer />
      <Grid item xs={12} display={"flex"} justifyContent={"space-between"}>
        <Typography>
          {totalPrice && totalPrice > 0
            ? "Total price: " + totalPrice + " AZN"
            : ""}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
        >
          Add Content
        </Button>
      </Grid>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Count</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Order time</TableCell>
                <TableCell>Waiting</TableCell>
                <TableCell>Status</TableCell>
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
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.count}</TableCell>
                    <TableCell>{row.amount} AZN</TableCell>
                    <TableCell>{row.order_time}</TableCell>
                    <TableCell>{row.pending}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell align="right">
                      {row?.status == "gozleyir" ? (
                        <IconButton
                          aria-label="delete"
                          size="large"
                          color="success"
                          onClick={() => handleDoneItem(row?.id)}
                        >
                          <DoneAllIcon />
                        </IconButton>
                      ) : (
                        ""
                      )}

                      {row?.status == "gozleyir" ? (
                        <IconButton
                          aria-label="delete"
                          size="large"
                          color="error"
                          onClick={() => handleCancelItem(row?.id)}
                        >
                          <CancelIcon />
                        </IconButton>
                      ) : (
                        ""
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
      {data?.length > 0 ? (
        <Grid item xs={12} display={"flex"} justifyContent={"end"}>
          <Button variant="outlined" color="error" onClick={() => endOrder()}>
            End Order
          </Button>
        </Grid>
      ) : (
        <Grid item xs={12} display={"flex"} justifyContent={"end"}>
          <Button
            variant="outlined"
            color="error"
            onClick={() => cancelOrder()}
          >
            Cancel Order
          </Button>
        </Grid>
      )}

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        PaperProps={{
          style: {
            minWidth: "400px",
          },
        }}
      >
        <form onSubmit={handleSubmit(addContent)}>
          <DialogTitle>{"Add person"}</DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12}>
                <InputLabel id="product">Product</InputLabel>

                <Controller
                  name="product"
                  control={control}
                  defaultValue=""
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <Select
                      labelId="product"
                      id="product"
                      label="Product"
                      variant="filled"
                      value={value}
                      onChange={onChange}
                      error={!!error}
                      fullWidth
                    >
                      {products?.map((product) => (
                        <MenuItem key={product?.id} value={product?.id}>
                          {product?.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <InputLabel id="product">Count</InputLabel>

                <ButtonGroup
                  variant="outlined"
                  aria-label="outlined primary button group"
                >
                  <Button onClick={() => handleDecrease()}>
                    <RemoveIcon />
                  </Button>
                  <Button>{productCount}</Button>
                  <Button onClick={() => handleIncrease()}>
                    <AddIcon />
                  </Button>
                </ButtonGroup>
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

export default ViewOrder;
