import React, { useState, useEffect, useMemo } from "react";
import { Grid, Button, TextField } from "@mui/material";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import publicAxios from "../../utils/publicAxios";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";

function EditProduct() {
  const { id } = useParams();
  const [data, setData] = useState({});
  const navigate = useNavigate();

  const getData = async () => {
    try {
      let res = await publicAxios.get(`/products/${id}`);
      setData(res?.data);
    } catch (error) {
      notifyError("Something went wrong");
    }
  };
  useEffect(() => {
    getData();
  }, []);
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

  //   add data via modal
  const formSchema = Yup.object().shape({
    name: Yup.string().trim().required("* This field is required."),
    price: Yup.number()
      .typeError("* This field  should be number")
      .required("* This field is required."),
    description: Yup.string().trim().required("* This field is required."),
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    defaultValues: useMemo(() => {
      return data;
    }, [data]),
    resolver: yupResolver(formSchema),
  });

  // get old data
  useEffect(() => {
    reset(data);
  }, [data]);

  const addData = async (formData) => {
    try {
      await publicAxios.patch(`/products/${id}`, formData);
      notifySuccess("Product editted successfully");
      reset({
        name: "",
        price: "",
        description: "",
      });
      navigate("/products");
    } catch (error) {
      notifyError("Something went wrong");
    }
  };

  return (
    <Grid container spacing={2}>
      <ToastContainer />
      <Grid item xs={12}>
        <h2>Edit Product - {data?.name}</h2>
      </Grid>
      <Grid item xs={12} sm={6}>
        <form onSubmit={handleSubmit(addData)}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12}>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    label="Name"
                    variant="filled"
                    value={value}
                    onChange={onChange}
                    error={!!error}
                    helperText={error ? error.message : null}
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Controller
                name="price"
                control={control}
                defaultValue=""
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    type="number"
                    label="Price"
                    variant="filled"
                    value={value}
                    onChange={onChange}
                    error={!!error}
                    helperText={error ? error.message : null}
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Controller
                name="description"
                control={control}
                defaultValue=""
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    label="Description"
                    multiline
                    rows={5}
                    variant="filled"
                    value={value}
                    onChange={onChange}
                    error={!!error}
                    helperText={error ? error.message : null}
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Button type="submit" variant="outlined" color="success">
                Edit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
}

export default EditProduct;
